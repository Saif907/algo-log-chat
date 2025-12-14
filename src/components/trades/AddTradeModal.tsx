import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2, DollarSign, Target, BookOpen } from "lucide-react";

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
import { Label } from "@/components/ui/label";
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

// --- Schema Definition ---
// Use combined datetime inputs (datetime-local) for mobile friendliness.
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

    // entry_datetime and exit_datetime will be submitted as strings (datetime-local) and preprocessed to Date objects
    entry_datetime: z.preprocess((val) => (val ? new Date(val as string) : val), z.date()),
    exit_datetime: z.preprocess((val) => (val ? new Date(val as string) : val), z.date().optional()),

    strategy_id: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Closed Trade Requirements
    if (data.status === "CLOSED") {
      if (!data.exit_price || data.exit_price <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exit Price is required for closed trades", path: ["exit_price"] });
      }
      if (!data.exit_datetime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exit Date/Time is required", path: ["exit_datetime"] });
      }

      // Time Logic Check
      if (data.exit_datetime && data.entry_datetime) {
        if (data.exit_datetime < data.entry_datetime) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exit cannot be before Entry", path: ["exit_datetime"] });
        }
      }
    }

    // Risk Logic
    if (data.stop_loss) {
      if (data.direction === "LONG" && data.stop_loss >= data.entry_price) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Stop Loss must be below Entry for Longs", path: ["stop_loss"] });
      }
      if (data.direction === "SHORT" && data.stop_loss <= data.entry_price) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Stop Loss must be above Entry for Shorts", path: ["stop_loss"] });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeModal = ({ open, onOpenChange }: Props) => {
  const { createTrade } = useTrades();
  const { strategies } = useStrategies();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Default Values: use datetime-local format for default (string)
  const now = new Date();
  const nowLocal = format(now, "yyyy-MM-dd'T'HH:mm");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "CLOSED", // user requested default CLOSED
      symbol: "",
      instrument_type: "STOCK",
      direction: "LONG",
      entry_datetime: (nowLocal as unknown) as any,
      exit_datetime: undefined,
      fees: 0,
      notes: "",
    },
  });

  const watchValues = form.watch();

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setShowAdvanced(false);
    }
  }, [open, form]);

  // When status changes, populate/clear exit fields appropriately
  useEffect(() => {
    if (watchValues.status === "CLOSED") {
      if (!watchValues.exit_datetime) form.setValue("exit_datetime", (nowLocal as unknown) as any);
    } else {
      form.setValue("exit_datetime", undefined);
      form.setValue("exit_price", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchValues.status]);

  const getStep = (instrument?: FormValues["instrument_type"]) => {
    switch (instrument) {
      case "CRYPTO":
        return "0.0001";
      case "FOREX":
        return "0.0001";
      default:
        return "0.01";
    }
  };

  const calculateRR = () => {
    const { entry_price, stop_loss, target } = watchValues as any;
    if (!entry_price || !stop_loss || !target) return null;
    const risk = Math.abs(entry_price - stop_loss);
    const reward = Math.abs(target - entry_price);
    return risk === 0 ? null : (reward / risk).toFixed(2);
  };

  const calculatePnL = () => {
    const { status, entry_price, exit_price, quantity, direction, fees } = watchValues as any;
    if (status !== "CLOSED" || !entry_price || !exit_price || !quantity) return null;

    const multiplier = direction === "LONG" ? 1 : -1;
    const gross = (exit_price - entry_price) * quantity * multiplier;
    const net = gross - (fees || 0);
    return net;
  };

  const rrRatio = calculateRR();
  const pnl = calculatePnL();

  const onSubmit = async (values: FormValues) => {
    // entry_datetime and exit_datetime are strings in datetime-local format; zod preprocess converts to Dates
    const entryIso = (values.entry_datetime as unknown as Date).toISOString();
    const exitIso = values.exit_datetime ? (values.exit_datetime as unknown as Date).toISOString() : undefined;

    await createTrade.mutateAsync({
      ...values,
      entry_time: entryIso,
      exit_time: exitIso,
      strategy_id: values.strategy_id === "none" ? undefined : values.strategy_id,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* max-h ensures viewport scrolling inside modal on small screens; removed custom scrollbar classes to match app styles */}
      <DialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[85vh] p-4 md:p-6 overflow-y-auto">
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
            {/* Status control */}
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

            {/* Symbol / Type / Direction grid */}
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
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STOCK">Stock</SelectItem>
                            <SelectItem value="CRYPTO">Crypto</SelectItem>
                            <SelectItem value="FUTURES">Futures</SelectItem>
                            <SelectItem value="FOREX">Forex</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
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
                      <FormControl>
                        <Tabs value={field.value} onValueChange={(v: any) => field.onChange(v)} className="w-full">
                          <TabsList className="grid grid-cols-2 gap-1">
                            <TabsTrigger value="LONG" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600">Long</TabsTrigger>
                            <TabsTrigger value="SHORT" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-600">Short</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Entry block: calendar + time popover on desktop, native datetime-local on mobile */}
            <section className="space-y-2">
              <h3 className="text-sm font-medium">Entry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="entry_datetime"
                  render={({ field }) => {
                    const current = field.value as string | undefined;
                    const selectedDate = current ? new Date(current) : new Date();
                    const timeValue = format(selectedDate, "HH:mm");

                    return (
                      <FormItem>
                        <FormLabel className="text-xs">Date & Time</FormLabel>

                        {/* Mobile: native picker */}
                        <div className="block sm:hidden">
                          <FormControl>
                            <Input type="datetime-local" value={current || nowLocal} onChange={(e) => field.onChange(e.target.value)} />
                          </FormControl>
                        </div>

                        {/* Desktop: popover with calendar + time */}
                        <div className="hidden sm:block">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full text-left">
                                {current ? format(new Date(current), "MMM d, yyyy — HH:mm") : "Select date & time"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3">
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Calendar
                                  mode="single"
                                  selected={current ? new Date(current) : new Date()}
                                  onSelect={(date) => {
                                    if (!date) return;
                                    const t = (current ? format(new Date(current), "HH:mm") : format(new Date(), "HH:mm"));
                                    const combined = format(date, "yyyy-MM-dd") + "T" + t;
                                    field.onChange(combined);
                                  }}
                                />

                                <div className="flex flex-col gap-2 w-40">
                                  <Label className="text-xs">Time</Label>
                                  <Input
                                    type="time"
                                    value={timeValue}
                                    onChange={(e) => {
                                      const datePart = current ? format(new Date(current), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
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
                  }}
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
                        <Input type="number" step="1" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="hidden md:block" />
              </div>
            </section>

            {/* Exit block (conditional) */}
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
                  <FormField
                    control={form.control}
                    name="exit_datetime"
                    render={({ field }) => {
                      const current = field.value as string | undefined;
                      const selectedDate = current ? new Date(current) : new Date();
                      const timeValue = format(selectedDate, "HH:mm");

                      return (
                        <FormItem>
                          <FormLabel className="text-xs">Date & Time</FormLabel>

                          <div className="block sm:hidden">
                            <FormControl>
                              <Input type="datetime-local" value={current || nowLocal} onChange={(e) => field.onChange(e.target.value)} />
                            </FormControl>
                          </div>

                          <div className="hidden sm:block">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left">
                                  {current ? format(new Date(current), "MMM d, yyyy — HH:mm") : "Select date & time"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Calendar
                                    mode="single"
                                    selected={current ? new Date(current) : new Date()}
                                    onSelect={(date) => {
                                      if (!date) return;
                                      const t = (current ? format(new Date(current), "HH:mm") : format(new Date(), "HH:mm"));
                                      const combined = format(date, "yyyy-MM-dd") + "T" + t;
                                      field.onChange(combined);
                                    }}
                                  />

                                  <div className="flex flex-col gap-2 w-40">
                                    <Label className="text-xs">Time</Label>
                                    <Input
                                      type="time"
                                      value={timeValue}
                                      onChange={(e) => {
                                        const datePart = current ? format(new Date(current), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
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
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="exit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Exit Price</FormLabel>
                        <FormControl>
                          <Input type="number" step={getStep(watchValues.instrument_type)} placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Fees / Comm.</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div />
                </div>
              </section>
            )}

            {/* Additional details toggle */}
            <div className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdvanced((v) => !v)}>
                {showAdvanced ? "Hide additional details" : "Add additional details"}
              </Button>
            </div>

            {/* Advanced (collapsible) */}
            {showAdvanced && (
              <section className="space-y-4 pt-3 border-t">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <div className="font-medium">Risk Planning (Optional)</div>
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
                          <FormControl>
                            <Input type="number" step={getStep(watchValues.instrument_type)} {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input type="number" step={getStep(watchValues.instrument_type)} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <BookOpen className="w-4 h-4" />
                    <div className="font-medium">Strategy (Optional)</div>
                  </div>

                  <FormField
                    control={form.control}
                    name="strategy_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Playbook..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Strategy</SelectItem>
                              {strategies?.map((s) => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Notes / Mistakes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What was your thesis?" className="min-h-[70px] resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            )}

            {/* Footer: responsive layout */}
            <DialogFooter className="pt-4">
              <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="min-w-[120px] w-full sm:w-auto" disabled={createTrade.isPending}>
                  {createTrade.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Trade"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};