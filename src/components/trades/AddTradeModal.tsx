import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Upload, X, ChevronDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeModal = ({ open, onOpenChange }: AddTradeModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [isOptionalOpen, setIsOptionalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      const fetchStrategies = async () => {
        const { data } = await supabase.from('strategies').select('id, name');
        if (data) setStrategies(data);
      };
      fetchStrategies();
    }
  }, [open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshots([...screenshots, ...Array.from(e.target.files)]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const uploadScreenshots = async (userId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of screenshots) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('trade-screenshots')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('trade-screenshots')
        .getPublicUrl(fileName);
      
      urls.push(publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const formData = new FormData(e.target as HTMLFormElement);
      
      const entryDate = formData.get("entry-date") as string;
      const exitDate = formData.get("exit-date") as string;
      
      const entryPrice = parseFloat(formData.get("entry-price") as string);
      const exitPrice = parseFloat(formData.get("exit-price") as string) || null;
      const quantity = parseFloat(formData.get("quantity") as string);
      const stopLoss = parseFloat(formData.get("stop-loss") as string) || null;
      const target = parseFloat(formData.get("target") as string) || null;
      
      // Handle Direction Enum (Must be UPPERCASE)
      const direction = formData.get("side") as string;
      const directionFormatted = direction ? direction.toUpperCase() : "LONG";
      
      // Calculate PnL
      let pnl = null;
      if (exitPrice !== null && !isNaN(entryPrice) && !isNaN(quantity)) {
        if (directionFormatted === "LONG") {
          pnl = (exitPrice - entryPrice) * quantity;
        } else {
          pnl = (entryPrice - exitPrice) * quantity;
        }
      }

      // Handle Strategy ID (Fix for "invalid input syntax for type uuid")
      const rawStrategyId = formData.get("strategy") as string;
      const strategyId = (rawStrategyId && rawStrategyId !== "none" && rawStrategyId !== "") ? rawStrategyId : null;

      const uploadedUrls = await uploadScreenshots(user.id);

      const tradeData = {
        user_id: user.id,
        symbol: (formData.get("symbol") as string).toUpperCase(),
        direction: directionFormatted,
        status: exitPrice ? "CLOSED" : "OPEN",
        entry_price: entryPrice,
        exit_price: exitPrice,
        quantity: quantity,
        pnl: pnl,
        stop_loss: stopLoss,
        target: target,
        entry_time: new Date(entryDate).toISOString(),
        exit_time: exitDate ? new Date(exitDate).toISOString() : null,
        encrypted_notes: formData.get("notes") as string,
        strategy_id: strategyId,
        emotion: formData.get("emotional-state") as string,
        encrypted_screenshots: uploadedUrls,
        tags: [],
      };

      const { error } = await supabase.from('trades').insert(tradeData);
      if (error) throw error;

      toast({ title: "Success", description: "Trade logged successfully" });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      onOpenChange(false);
      setScreenshots([]);
      
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add trade", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Symbol *</Label>
              <Input name="symbol" placeholder="TSLA" required />
            </div>
            <div className="space-y-2">
              <Label>Side *</Label>
              <Select name="side" required defaultValue="long">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Entry Price *</Label>
              <Input name="entry-price" type="number" step="0.0001" required />
            </div>
            <div className="space-y-2">
              <Label>Exit Price</Label>
              <Input name="exit-price" type="number" step="0.0001" />
            </div>
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input name="quantity" type="number" required />
            </div>
            <div className="space-y-2">
              <Label>Entry Time *</Label>
              <Input name="entry-date" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label>Exit Time</Label>
              <Input name="exit-date" type="datetime-local" />
            </div>
          </div>

          {/* Optional Fields */}
          <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="outline" className="w-full flex justify-between">
                <span>Detailed Info (Strategy, Risk, Notes)</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOptionalOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stop Loss</Label>
                  <Input name="stop-loss" type="number" step="0.0001" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Input name="target" type="number" step="0.0001" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select name="strategy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Strategy</SelectItem>
                      {strategies.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Emotion</Label>
                  <Select name="emotional-state">
                    <SelectTrigger>
                      <SelectValue placeholder="How did you feel?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confident">Confident</SelectItem>
                      <SelectItem value="Fearful">Fearful</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Greedy">Greedy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" placeholder="Trade analysis..." />
              </div>

              {/* Screenshots */}
              <div className="space-y-2">
                <Label>Screenshots</Label>
                <Card className="border-dashed border-2 p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload images</span>
                    <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </Card>
                {screenshots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {screenshots.map((file, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(file)} alt="preview" className="h-20 w-full object-cover rounded" />
                        <button type="button" onClick={() => removeScreenshot(i)} className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};