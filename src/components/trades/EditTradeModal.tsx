// frontend/src/components/trades/EditTradeModal.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2, DollarSign, Lock, CloudUpload, Tag, X, Calendar as CalendarIcon, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useTrades } from "@/hooks/use-trades";
import { useStrategies } from "@/hooks/use-strategies";
import { cn } from "@/lib/utils";
import { api, Trade } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useModal } from "@/contexts/ModalContext";
import { useCurrency } from "@/contexts/CurrencyContext"; // ✅ Added Currency Context

/* -------------------- Schema -------------------- */
const formSchema = z
  .object({
    symbol: z.string().min(1, "Symbol is required").transform((s) => s.toUpperCase()),
    instrument_type: z.enum(["STOCK", "CRYPTO", "FOREX", "FUTURES"]),
    direction: z.enum(["LONG", "SHORT"]),
    status: z.enum(["OPEN", "CLOSED"]),

    entry_price: z.coerce.number().positive("Entry Price must be positive"),
    quantity: z.coerce.number().positive("Quantity must be positive"),

    exit_price: z.coerce.number().optional(),
    stop_loss: z.coerce.number().optional(),
    target: z.coerce.number().optional(),
    fees: z.coerce.number().optional().default(0),

    entry_datetime: z.date({ required_error: "Entry Date is required" }),
    exit_datetime: z.date().optional(),

    strategy_id: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    new_screenshots: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    if (data.entry_datetime > now) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Entry date cannot be in the future", path: ["entry_datetime"] });
    }
    if (data.status === "CLOSED") {
      if (!data.exit_price || data.exit_price <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exit Price is required for closed trades", path: ["exit_price"] });
      }
      if (!data.exit_datetime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exit Date/Time is required", path: ["exit_datetime"] });
      } else {
        if (data.exit_datetime < data.entry_datetime) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exit cannot be before Entry time", path: ["exit_datetime"] });
        }
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface Props {
  trade: Trade | null;
  // ✅ NEW: Receive existing screenshots directly from parent to avoid re-fetching
  existingScreenshots?: { url: string }[]; 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTradeModal = ({ trade, existingScreenshots = [], open, onOpenChange }: Props) => {
  const { updateTrade, deleteTrade, uploadScreenshots } = useTrades();
  const { strategies } = useStrategies();
  const { toast } = useToast();
  const { plan } = useAuth();
  const { openUpgradeModal } = useModal();
  const { currency, rate } = useCurrency(); // ✅ Get currency info
  const isPro = plan === "PRO" || plan === "FOUNDER";

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Form Setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: "OPEN",
      symbol: "",
      instrument_type: "STOCK",
      direction: "LONG",
      entry_datetime: new Date(),
      fees: 0,
      notes: "",
      tags: [],
      new_screenshots: [],
    },
  });

  // ✅ Hydrate Form from Props (Convert USD -> User Currency)
  useEffect(() => {
    if (trade && open) {
      // Helper to convert DB value (USD) to displayed value (User Currency)
      const toUserCurrency = (val?: number) => (val !== undefined && val !== null) ? val * (rate || 1) : undefined;

      form.reset({
        symbol: trade.symbol,
        instrument_type: trade.instrument_type,
        direction: trade.direction,
        status: trade.status,
        entry_price: toUserCurrency(trade.entry_price), // Convert
        quantity: trade.quantity,
        entry_datetime: new Date(trade.entry_time),
        
        exit_price: toUserCurrency(trade.exit_price), // Convert
        exit_datetime: trade.exit_time ? new Date(trade.exit_time) : undefined,
        
        stop_loss: toUserCurrency(trade.stop_loss), // Convert
        target: toUserCurrency(trade.target), // Convert
        fees: toUserCurrency(trade.fees) || 0, // Convert
        
        strategy_id: trade.strategy_id || "none",
        notes: trade.notes || "",
        tags: trade.tags || [],
        new_screenshots: [],
      });
      
      // Auto-expand advanced section if data exists
      if (trade.stop_loss || trade.target || (trade.tags && trade.tags.length > 0)) {
        setShowAdvanced(true);
      }
    }
  }, [trade, open, form, rate]);

  // Preview Logic for NEW files
  const watchScreenshots = form.watch("new_screenshots");
  useEffect(() => {
    const files: File[] = (watchScreenshots as any) || [];
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [watchScreenshots]);

  // --- Handlers ---

  const handleFilesAdd = (incoming: FileList | File[]) => {
    if (!isPro) {
        openUpgradeModal("Attach screenshots to your trades. Upgrade to PRO.");
        return;
    }
    const existingFiles: File[] = (form.getValues("new_screenshots") as any) || [];
    const incomingArr = Array.from(incoming as FileList);
    const valid: File[] = [];
    for (const f of incomingArr) {
      if (f.size > 5 * 1024 * 1024) { 
        toast({ title: "File too large", description: `${f.name} exceeds 5MB`, variant: "destructive" });
        continue;
      }
      valid.push(f);
    }
    if (valid.length === 0) return;
    form.setValue("new_screenshots", [...existingFiles, ...valid]);
  };

  const removeNewScreenshot = (index: number) => {
    const existing: File[] = (form.getValues("new_screenshots") as any) || [];
    const copy = existing.slice();
    copy.splice(index, 1);
    form.setValue("new_screenshots", copy);
  };

  // ⚠️ NOTE: Deleting existing screenshots requires specific backend support not currently in trades.py.
  // For now, we show a toast. To fix this fully, add a delete_screenshot endpoint to backend.
  const handleDeleteExistingScreenshot = (url: string) => {
      toast({ title: "Feature Pending", description: "Deleting individual existing screenshots is coming soon.", variant: "default" });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        if (!isPro) {
            openUpgradeModal("Tagging is a PRO feature.");
            return;
        }
        const trimmed = currentTag.trim();
        if (!trimmed) return;
        const currentTags = form.getValues("tags") || [];
        if (!currentTags.includes(trimmed)) {
            form.setValue("tags", [...currentTags, trimmed]);
        }
        setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!isPro) return;
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(t => t !== tagToRemove));
  };

  const onSubmit = async (values: FormValues) => {
    if (!trade) return;
    try {
      const entryIso = values.entry_datetime.toISOString();
      const exitIso = values.exit_datetime ? values.exit_datetime.toISOString() : undefined;

      // ✅ Currency Conversion: Convert User Currency -> USD before saving
      const appliedRate = (currency !== "USD" && rate > 0) ? rate : 1;
      const toUSD = (val?: number) => (val !== undefined && val !== null) ? val / appliedRate : undefined;

      const payload: any = {
        symbol: values.symbol,
        instrument_type: values.instrument_type,
        direction: values.direction,
        status: values.status,
        entry_price: toUSD(values.entry_price),
        quantity: values.quantity,
        entry_time: entryIso,
        fees: toUSD(values.fees) || 0,
        stop_loss: toUSD(values.stop_loss),
        target: toUSD(values.target),
        exit_price: toUSD(values.exit_price),
        exit_time: exitIso,
        strategy_id: values.strategy_id === "none" ? undefined : values.strategy_id,
        notes: values.notes,
        tags: values.tags,
      };

      await updateTrade.mutateAsync({ id: trade.id, updates: payload });

      // Upload NEW screenshots
      const filesToUpload: File[] = (values.new_screenshots as any) || [];
      if (filesToUpload.length > 0) {
         await uploadScreenshots.mutateAsync({ files: filesToUpload, tradeId: trade.id });
      }

      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!trade) return;
    await deleteTrade.mutateAsync(trade.id);
    onOpenChange(false);
  };

  // Helper
  const DatePickerField = ({ field, label, minDate }: { field: any, label: string, minDate?: Date }) => {
    const current = field.value as Date | undefined;
    const now = new Date();
    return (
        <FormItem>
          <FormLabel className="text-xs">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full text-left font-normal px-3", !current && "text-muted-foreground")}>
                  {current ? format(current, "MMM d, HH:mm") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="flex flex-col gap-3">
                <Calendar 
                  mode="single" 
                  selected={current || now} 
                  disabled={(date) => { 
                      const isFuture = date > now; 
                      const isBeforeEntry = minDate ? date < new Date(minDate.setHours(0,0,0,0)) : false; 
                      return isFuture || isBeforeEntry; 
                  }} 
                  onSelect={(date) => { 
                      if (!date) return; 
                      const currentTime = current ? format(current, "HH:mm") : format(now, "HH:mm"); 
                      const combined = new Date(format(date, "yyyy-MM-dd") + "T" + currentTime);
                      field.onChange(combined); 
                  }} 
                  initialFocus 
                />
                <div className="flex items-center gap-2">
                   <span className="text-xs">Time:</span>
                   <Input 
                        type="time" 
                        className="h-8"
                        value={current ? format(current, "HH:mm") : format(now, "HH:mm")} 
                        onChange={(e) => { 
                            const datePart = current ? format(current, "yyyy-MM-dd") : format(now, "yyyy-MM-dd"); 
                            const combined = new Date(datePart + "T" + e.target.value);
                            field.onChange(combined); 
                        }} 
                    />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
    );
  };

  const isSubmitting = updateTrade.isPending || uploadScreenshots.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[85vh] p-4 md:p-6 overflow-y-auto modal-scroll">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            
            {/* Status Switcher */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Status</FormLabel>
                  <Tabs value={field.value} onValueChange={(v: any) => field.onChange(v)} className="w-full">
                    <TabsList className="grid grid-cols-2 gap-1">
                      <TabsTrigger value="OPEN" className="data-[state=active]:text-green-600">Open</TabsTrigger>
                      <TabsTrigger value="CLOSED" className="data-[state=active]:text-blue-600">Closed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormItem>
              )}
            />

            {/* Main Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Symbol</FormLabel>
                    <div className="relative">
                      <Input placeholder="AAPL" {...field} className="uppercase font-bold pl-8" />
                      <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                 <FormField
                    control={form.control}
                    name="instrument_type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-xs">Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="STOCK">Stock</SelectItem>
                            <SelectItem value="CRYPTO">Crypto</SelectItem>
                            <SelectItem value="FUTURES">Futures</SelectItem>
                            <SelectItem value="FOREX">Forex</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-xs">Side</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={field.value === "LONG" ? "text-green-600" : "text-red-600"}><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="LONG">Long</SelectItem>
                            <SelectItem value="SHORT">Short</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormItem>
                    )}
                 />
              </div>
            </div>

            {/* Entry Data */}
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField control={form.control} name="entry_datetime" render={({ field }) => <DatePickerField field={field} label="Entry Date" />} />
                <FormField control={form.control} name="entry_price" render={({ field }) => <FormItem><FormLabel className="text-xs">Entry Price ({currency})</FormLabel><Input type="number" step="any" {...field} /><FormMessage /></FormItem>} />
                <FormField control={form.control} name="quantity" render={({ field }) => <FormItem><FormLabel className="text-xs">Quantity</FormLabel><Input type="number" step="any" {...field} /><FormMessage /></FormItem>} />
            </div>

            {/* Exit Data */}
            {form.watch("status") === "CLOSED" && (
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1">
                    <FormField control={form.control} name="exit_datetime" render={({ field }) => <DatePickerField field={field} label="Exit Date" minDate={form.getValues("entry_datetime")} />} />
                    <FormField control={form.control} name="exit_price" render={({ field }) => <FormItem><FormLabel className="text-xs">Exit Price ({currency})</FormLabel><Input type="number" step="any" {...field} /><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="fees" render={({ field }) => <FormItem><FormLabel className="text-xs">Fees ({currency})</FormLabel><Input type="number" step="0.01" {...field} /></FormItem>} />
                </div>
            )}

            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs h-8">
                {showAdvanced ? "Hide Details" : "Show Strategy & Tags"}
            </Button>

            {showAdvanced && (
                <div className="space-y-4 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="stop_loss" render={({ field }) => <FormItem><FormLabel className="text-xs">Stop Loss ({currency})</FormLabel><Input type="number" step="any" {...field} /></FormItem>} />
                        <FormField control={form.control} name="target" render={({ field }) => <FormItem><FormLabel className="text-xs">Target ({currency})</FormLabel><Input type="number" step="any" {...field} /></FormItem>} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Strategy */}
                        <FormField
                            control={form.control}
                            name="strategy_id"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-xs">Strategy</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || "none"}>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {strategies.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                </FormItem>
                            )}
                        />

                        {/* PRO Tags */}
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel className="text-xs">Tags</FormLabel>
                                        {!isPro && <Badge variant="secondary" className="text-[10px] px-1 h-5"><Lock className="w-3 h-3 mr-1"/> PRO</Badge>}
                                    </div>
                                    <div className={cn("space-y-2", !isPro && "opacity-60 pointer-events-none")}>
                                        <div className="relative">
                                            <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                placeholder="Add tag..." 
                                                className="pl-9 h-9" 
                                                value={currentTag}
                                                onChange={e => setCurrentTag(e.target.value)}
                                                onKeyDown={handleAddTag}
                                                disabled={!isPro}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {field.value?.map((tag, i) => (
                                                <Badge key={i} variant="outline" className="gap-1 pr-1">
                                                    {tag}
                                                    <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Notes */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Notes</FormLabel>
                                <Textarea className="min-h-[80px]" {...field} />
                            </FormItem>
                        )}
                    />

                    {/* Screenshots Management */}
                    <FormField
                        control={form.control}
                        name="new_screenshots"
                        render={({ field }) => {
                            const newFiles = (field.value as File[]) || [];
                            return (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel className="text-xs">Screenshots</FormLabel>
                                        {!isPro && <Badge variant="secondary" className="text-[10px] px-1 h-5"><Lock className="w-3 h-3 mr-1"/> PRO</Badge>}
                                    </div>
                                    
                                    {/* Upload Area */}
                                    <div 
                                        className={cn(
                                            "border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:bg-muted/50 mb-2",
                                            !isPro && "opacity-60 cursor-not-allowed hover:bg-transparent"
                                        )}
                                        onClick={() => !isPro && openUpgradeModal("Upload screenshots with PRO.")}
                                    >
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*" 
                                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                disabled={!isPro}
                                                onChange={(e) => {
                                                    if(e.target.files) handleFilesAdd(e.target.files);
                                                    e.target.value = "";
                                                }}
                                            />
                                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                <CloudUpload className="h-6 w-6" />
                                                <span className="text-xs">Click to upload new images</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid of Screenshots (Existing + New) */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {/* Existing Screenshots (Passed via Props) */}
                                        {existingScreenshots.map((file, i) => (
                                            <div key={`exist-${i}`} className="relative aspect-video bg-muted rounded overflow-hidden group border border-blue-500/30">
                                                <img src={file.url} className="w-full h-full object-cover opacity-80" />
                                                {/* Badge to show it's already saved */}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5">Saved</div>
                                                <button type="button" onClick={() => handleDeleteExistingScreenshot(file.url)} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* New Pending Uploads */}
                                        {newFiles.map((_, i) => (
                                            <div key={`new-${i}`} className="relative aspect-video bg-muted rounded overflow-hidden group border border-green-500/50">
                                                <img src={previewUrls[i]} className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[8px] text-center py-0.5">New</div>
                                                <button type="button" onClick={() => removeNewScreenshot(i)} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </FormItem>
                            );
                        }}
                    />
                </div>
            )}

            <DialogFooter className="flex justify-between items-center sm:justify-between border-t pt-4 mt-4">
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 h-9 px-2">
                        <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Delete Trade</span>
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Delete Trade?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>

               <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Save Changes
                  </Button>
               </div>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};