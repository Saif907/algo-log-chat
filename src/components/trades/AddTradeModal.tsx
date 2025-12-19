// frontend/src/components/trades/AddTradeModal.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2, DollarSign, Target, Lock, CloudUpload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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

import { useTrades } from "@/hooks/use-trades";
import { useStrategies } from "@/hooks/use-strategies";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useModal } from "@/contexts/ModalContext";

/* -------------------- Schema with Strict Logic -------------------- */
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

    entry_datetime: z.preprocess((val) => {
      if (typeof val === "string" && val) return new Date(val);
      return val;
    }, z.date({ required_error: "Entry Date is required" })),

    exit_datetime: z.preprocess((val) => {
      if (typeof val === "string" && val) return new Date(val);
      return val;
    }, z.date().optional()),

    strategy_id: z.string().optional(),
    notes: z.string().optional(),
    screenshots: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();

    // 1. Future Entry Date Check
    if (data.entry_datetime > now) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Entry date cannot be in the future",
            path: ["entry_datetime"],
        });
    }

    // 2. Closed Trade Validation
    if (data.status === "CLOSED") {
      if (!data.exit_price || data.exit_price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Exit Price is required for closed trades",
          path: ["exit_price"],
        });
      }
      if (!data.exit_datetime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Exit Date/Time is required",
          path: ["exit_datetime"],
        });
      } else {
        if (data.exit_datetime > now) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Exit date cannot be in the future",
                path: ["exit_datetime"],
            });
        }
        if (data.exit_datetime < data.entry_datetime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Exit cannot be before Entry time",
            path: ["exit_datetime"],
          });
        }
      }
    }

    // ✅ 3. STRICT STOP LOSS LOGIC
    if (data.stop_loss && data.stop_loss > 0 && data.entry_price > 0) {
      // LONG: SL must be LOWER than Entry
      if (data.direction === "LONG" && data.stop_loss >= data.entry_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Long Trade: Stop Loss must be BELOW Entry",
          path: ["stop_loss"],
        });
      }
      // SHORT: SL must be HIGHER than Entry
      if (data.direction === "SHORT" && data.stop_loss <= data.entry_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Short Trade: Stop Loss must be ABOVE Entry",
          path: ["stop_loss"],
        });
      }
    }

    // ✅ 4. STRICT TARGET LOGIC
    if (data.target && data.target > 0 && data.entry_price > 0) {
      // LONG: Target must be HIGHER than Entry
      if (data.direction === "LONG" && data.target <= data.entry_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Long Trade: Target must be ABOVE Entry",
          path: ["target"],
        });
      }
      // SHORT: Target must be LOWER than Entry
      if (data.direction === "SHORT" && data.target >= data.entry_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Short Trade: Target must be BELOW Entry",
          path: ["target"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function uploadTradeScreenshotsAndGetUrls(tradeId: string, files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];
  for (const file of files) {
    if (!(file instanceof File)) continue;
    const resp = await api.trades.uploadScreenshot(tradeId, file);
    if (!resp || !resp.success) {
      throw new Error(`Upload failed for ${file.name}`);
    }
  }
  const signed = await api.trades.getScreenshots(tradeId);
  return (signed.files || []).map((f: any) => f.url).filter(Boolean);
}

export const AddTradeModal = ({ open, onOpenChange }: Props) => {
  const { createTrade } = useTrades();
  const { strategies } = useStrategies();
  const { toast } = useToast();
  const { plan } = useAuth();
  const { openUpgradeModal } = useModal();
  const isPro = plan === "PRO" || plan === "FOUNDER";

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const nowLocal = format(now, "yyyy-MM-dd'T'HH:mm");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // ✅ Instant Validation Feedback
    defaultValues: {
      status: "CLOSED",
      symbol: "",
      instrument_type: "STOCK",
      direction: "LONG",
      entry_datetime: (nowLocal as unknown) as any,
      exit_datetime: undefined,
      fees: 0,
      notes: "",
      screenshots: [],
    },
  });

  const watchValues = form.watch();
  
  const entryDateObj = watchValues.entry_datetime 
    ? new Date(watchValues.entry_datetime as unknown as string) 
    : undefined;

  useEffect(() => {
    const files: File[] = (watchValues.screenshots as any) || [];
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [watchValues.screenshots]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setShowAdvanced(false);
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
      setPreviewUrls([]);
      setSignedUrls([]);
    }
  }, [open]);

  useEffect(() => {
    if (watchValues.status === "CLOSED") {
      if (!watchValues.exit_datetime) form.setValue("exit_datetime", (nowLocal as unknown) as any);
    } else {
      form.setValue("exit_datetime", undefined);
      form.setValue("exit_price", undefined);
    }
  }, [watchValues.status]);

  const getStep = (instrument?: FormValues["instrument_type"]) => {
    switch (instrument) {
      case "CRYPTO": return "0.0001";
      case "FOREX": return "0.0001";
      default: return "0.01";
    }
  };

  const calculateRR = () => {
    const anyVals = watchValues as any;
    const { entry_price, stop_loss, target } = anyVals;
    if (!entry_price || !stop_loss || !target) return null;
    const risk = Math.abs(entry_price - stop_loss);
    const reward = Math.abs(target - entry_price);
    return risk === 0 ? null : (reward / risk).toFixed(2);
  };

  const calculatePnL = () => {
    const anyVals = watchValues as any;
    const { status, entry_price, exit_price, quantity, direction, fees } = anyVals;
    if (status !== "CLOSED" || !entry_price || !exit_price || !quantity) return null;
    const multiplier = direction === "LONG" ? 1 : -1;
    const gross = (exit_price - entry_price) * quantity * multiplier;
    const net = gross - (fees || 0);
    return net;
  };

  const rrRatio = calculateRR();
  const pnl = calculatePnL();
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 

  const handleFilesAdd = (incoming: FileList | File[]) => {
    if (!isPro) {
        openUpgradeModal("Attach screenshots to your trades to analyze patterns visually. Upgrade to PRO.");
        return;
    }
    const existing: File[] = (watchValues.screenshots as any) || [];
    const incomingArr = Array.from(incoming as FileList);
    const allowedToAdd = Math.max(0, MAX_FILES - existing.length);
    const candidates = incomingArr.slice(0, allowedToAdd);
    const valid: File[] = [];
    
    for (const f of candidates) {
      if (f.size > MAX_FILE_SIZE) {
        toast({ title: "File too large", description: `${f.name} exceeds 5MB`, variant: "destructive" });
        continue;
      }
      valid.push(f);
    }
    if (valid.length === 0) return;
    form.setValue("screenshots", [...existing, ...valid]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPro) {
        openUpgradeModal("Attach screenshots to your trades to analyze patterns visually. Upgrade to PRO.");
        return;
    }
    if (e.dataTransfer?.files?.length) {
      handleFilesAdd(e.dataTransfer.files);
    }
  };

  const removeScreenshot = (index: number) => {
    const existing: File[] = (watchValues.screenshots as any) || [];
    const copy = existing.slice();
    copy.splice(index, 1);
    form.setValue("screenshots", copy);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const entryIso = (values.entry_datetime as unknown as Date).toISOString();
      const exitIso = values.exit_datetime ? (values.exit_datetime as unknown as Date).toISOString() : undefined;

      const payload: any = {
        symbol: values.symbol,
        instrument_type: values.instrument_type,
        direction: values.direction,
        status: values.status,
        entry_price: values.entry_price,
        quantity: values.quantity,
        entry_time: entryIso,
        fees: values.fees || 0,
        stop_loss: values.stop_loss,
        target: values.target,
        exit_price: values.exit_price,
        exit_time: exitIso,
        strategy_id: values.strategy_id === "none" ? undefined : values.strategy_id,
        notes: values.notes || undefined,
      };

      const created = await createTrade.mutateAsync(payload);

      const filesToUpload: File[] = (values.screenshots as any) || [];
      if (filesToUpload.length > 0) {
        try {
          const urls = await uploadTradeScreenshotsAndGetUrls(created.id, filesToUpload);
          setSignedUrls(urls);
          toast({ title: "Screenshots uploaded", description: `${urls.length} files attached`, variant: "default" });
        } catch (uploadErr: any) {
          console.error("Screenshot upload error:", uploadErr);
          toast({
            title: "Partial success",
            description: "Trade created but screenshot upload failed.",
            variant: "destructive",
          });
        }
      }

      toast({ title: "Trade saved", description: "Your trade was logged successfully." });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to create trade:", err);
      toast({ title: "Error", description: err?.message || "Failed to save trade", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const DatePickerField = ({ 
    field, 
    label, 
    minDate 
  }: { 
    field: any, 
    label: string, 
    minDate?: Date 
  }) => {
    const current = field.value as string | undefined;
    const now = new Date();
    
    return (
        <FormItem>
          <FormLabel className="text-xs">{label}</FormLabel>
          <div className="block sm:hidden">
            <FormControl>
                <Input 
                    type="datetime-local" 
                    value={current || nowLocal} 
                    max={format(now, "yyyy-MM-dd'T'HH:mm")}
                    min={minDate ? format(minDate, "yyyy-MM-dd'T'HH:mm") : undefined}
                    onChange={(e) => field.onChange(e.target.value)} 
                />
            </FormControl>
          </div>
          <div className="hidden sm:block">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full text-left font-normal px-3", !current && "text-muted-foreground")}>
                  {current ? format(new Date(current), "MMM d, HH:mm") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Calendar
                    mode="single"
                    selected={current ? new Date(current) : now}
                    disabled={(date) => {
                        const isFuture = date > now;
                        const isBeforeEntry = minDate ? date < new Date(minDate.setHours(0,0,0,0)) : false;
                        return isFuture || isBeforeEntry;
                    }}
                    onSelect={(date) => {
                      if (!date) return;
                      const currentTime = current ? format(new Date(current), "HH:mm") : format(now, "HH:mm");
                      const combined = format(date, "yyyy-MM-dd") + "T" + currentTime;
                      field.onChange(combined);
                    }}
                    initialFocus
                  />
                  <div className="flex flex-col gap-2 w-40">
                    <FormLabel className="text-xs">Time</FormLabel>
                    <Input
                      type="time"
                      value={current ? format(new Date(current), "HH:mm") : format(now, "HH:mm")}
                      onChange={(e) => {
                        const datePart = current ? format(new Date(current), "yyyy-MM-dd") : format(now, "yyyy-MM-dd");
                        const combined = datePart + "T" + e.target.value;
                        field.onChange(combined);
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[85vh] p-4 md:p-6 overflow-y-auto modal-scroll">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold">Log Trade</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">Quick entry — additional fields are optional.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-3 min-w-0"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                form.handleSubmit(onSubmit)();
              }
            }}
          >
            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Trade Status</FormLabel>
                  <Tabs value={field.value} onValueChange={(v: any) => field.onChange(v)} className="w-full">
                    <TabsList className="grid grid-cols-2 gap-1">
                      <TabsTrigger value="OPEN" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600">Open</TabsTrigger>
                      <TabsTrigger value="CLOSED" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600">Closed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormItem>
              )}
            />

            {/* Main Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Symbol</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="AAPL" {...field} className="uppercase font-bold font-mono pl-9" />
                          <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-1 md:col-span-3">
                <FormField
                  control={form.control}
                  name="instrument_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              </div>
              <div className="sm:col-span-1 md:col-span-4">
                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Direction</FormLabel>
                      <Tabs value={field.value} onValueChange={(v: any) => field.onChange(v)} className="w-full">
                        <TabsList className="grid grid-cols-2 gap-1">
                          <TabsTrigger value="LONG" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600">Long</TabsTrigger>
                          <TabsTrigger value="SHORT" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-600">Short</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Entry Section */}
            <section className="space-y-2">
              <h3 className="text-sm font-medium">Entry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                
                {/* Entry Date */}
                <FormField
                  control={form.control}
                  name="entry_datetime"
                  render={({ field }) => <DatePickerField field={field} label="Date & Time" />}
                />
                
                <FormField
                  control={form.control}
                  name="entry_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Avg Price</FormLabel>
                      <FormControl>
                        <Input type="number" step={getStep(watchValues.instrument_type)} placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Qty / Lots</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Exit Section */}
            {watchValues.status === "CLOSED" && (
              <section className="space-y-2 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Exit</h3>
                  {pnl !== null && (
                    <div className="text-sm font-mono">
                      Net PnL: <span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>{pnl.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                   {/* Exit Date */}
                   <FormField
                      control={form.control}
                      name="exit_datetime"
                      render={({ field }) => (
                        <DatePickerField 
                            field={field} 
                            label="Date & Time" 
                            minDate={entryDateObj} 
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="exit_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Exit Price</FormLabel>
                          <Input type="number" step={getStep(watchValues.instrument_type)} placeholder="0.00" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Fees</FormLabel>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormItem>
                      )}
                    />
                </div>
              </section>
            )}

            {/* Advanced Toggle */}
            <div className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdvanced((v) => !v)}>
                {showAdvanced ? "Hide additional details" : "Add additional details"}
              </Button>
            </div>

            {/* Advanced Section */}
            {showAdvanced && (
              <section className="space-y-4 pt-3 border-t animate-in slide-in-from-top-2 duration-200">
                {/* Risk Management */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <div className="font-medium">Risk Planning</div>
                    </div>
                    {rrRatio && <Badge variant="outline" className="text-xs">1 : {rrRatio} RR</Badge>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <FormField
                      control={form.control}
                      name="stop_loss"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Stop Loss</FormLabel>
                          <Input type="number" step={getStep(watchValues.instrument_type)} {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Target</FormLabel>
                          <Input type="number" step={getStep(watchValues.instrument_type)} {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Strategy & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="strategy_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Strategy</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select Playbook..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Strategy</SelectItem>
                              {strategies?.map((s) => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Notes</FormLabel>
                          <Textarea placeholder="Trades thesis..." className="min-h-[40px] resize-none" {...field} />
                        </FormItem>
                      )}
                    />
                </div>

                {/* Screenshots (PRO ONLY) */}
                <FormField
                  control={form.control}
                  name="screenshots"
                  render={({ field }) => {
                    const files: File[] = (field.value as any) || [];
                    
                    return (
                      <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel className="text-xs">Screenshots</FormLabel>
                            {!isPro && (
                                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] h-5 px-1.5">
                                    <Lock className="w-3 h-3 mr-1" /> PRO
                                </Badge>
                            )}
                        </div>
                        <FormControl>
                          <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => {
                                if (!isPro) openUpgradeModal("Attach screenshots to visually analyze your trades. Upgrade to PRO.");
                            }}
                            className={cn(
                                "relative rounded-lg border border-dashed border-border p-4 transition-all",
                                isPro 
                                    ? "bg-muted/10 hover:bg-muted/20 cursor-pointer" 
                                    : "bg-muted/30 cursor-not-allowed opacity-80"
                            )}
                          >
                            <label
                              htmlFor="screenshot-upload"
                              className={cn(
                                  "flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground",
                                  !isPro && "pointer-events-none"
                              )}
                            >
                              {isPro ? (
                                  <>
                                    <CloudUpload className="w-8 h-8 text-muted-foreground/50" />
                                    <div className="text-center">
                                        <div className="font-medium text-foreground">Click to upload or drag & drop</div>
                                        <div className="text-xs">PNG, JPG • up to {MAX_FILES} images</div>
                                    </div>
                                  </>
                              ) : (
                                  <>
                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-foreground">Unlock Screenshots</div>
                                        <div className="text-xs text-muted-foreground mt-1">Upgrade to PRO to attach charts</div>
                                    </div>
                                  </>
                              )}

                              <input
                                id="screenshot-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                disabled={!isPro} 
                                onChange={(e) => {
                                  if (!e.target.files) return;
                                  handleFilesAdd(e.target.files);
                                  e.currentTarget.value = "";
                                }}
                              />
                            </label>

                            {/* Previews */}
                            {files.length > 0 && (
                              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {files.map((f, i) => (
                                  <div key={i} className="relative rounded-md overflow-hidden border group">
                                    <img src={previewUrls[i]} alt={f.name} className="h-16 w-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          removeScreenshot(i);
                                      }}
                                      className="absolute top-1 right-1 rounded-full bg-background/90 p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </section>
            )}

            <DialogFooter className="pt-4">
              <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Trade"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};