import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Upload, X, ChevronDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade?: {
    id: number;
    symbol: string;
    side: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    entryDate: string;
    exitDate: string;
    stopLoss?: number;
    target?: number;
    strategy?: string;
    emotionalState?: string;
    notes?: string;
    tags?: string[];
  };
}

export const EditTradeModal = ({ open, onOpenChange, trade }: EditTradeModalProps) => {
  const { toast } = useToast();
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [isOptionalOpen, setIsOptionalOpen] = useState(true);
  const [tags, setTags] = useState<string[]>(trade?.tags || []);
  const [newTag, setNewTag] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshots([...screenshots, ...Array.from(e.target.files)]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Trade updated successfully",
      description: "Your changes have been saved.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Trade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Required Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol *</Label>
                <Input id="symbol" placeholder="e.g., TSLA, BANKNIFTY" defaultValue={trade?.symbol} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="side">Side *</Label>
                <Select defaultValue={trade?.side} required>
                  <SelectTrigger id="side">
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-price">Entry Price *</Label>
                <Input id="entry-price" type="number" step="0.01" defaultValue={trade?.entryPrice} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit-price">Exit Price *</Label>
                <Input id="exit-price" type="number" step="0.01" defaultValue={trade?.exitPrice} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" defaultValue={trade?.quantity} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-date">Entry Date & Time *</Label>
                <Input id="entry-date" type="datetime-local" defaultValue={trade?.entryDate} required />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="exit-date">Exit Date & Time *</Label>
                <Input id="exit-date" type="datetime-local" defaultValue={trade?.exitDate} required />
              </div>
            </div>
          </div>

          {/* Tags Management */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a tag..." 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Optional Fields - Collapsible */}
          <Collapsible open={isOptionalOpen} onOpenChange={setIsOptionalOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-between"
              >
                <span>Optional Details</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOptionalOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss</Label>
                  <Input id="stop-loss" type="number" step="0.01" defaultValue={trade?.stopLoss} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input id="target" type="number" step="0.01" defaultValue={trade?.target} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy / Playbook</Label>
                  <Select defaultValue={trade?.strategy}>
                    <SelectTrigger id="strategy">
                      <SelectValue placeholder="Select playbook" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orb">ORB Breakout</SelectItem>
                      <SelectItem value="pullback">Pullback Entry</SelectItem>
                      <SelectItem value="momentum">Momentum Trade</SelectItem>
                      <SelectItem value="reversal">Reversal</SelectItem>
                      <SelectItem value="none">No Playbook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emotional-state">Emotional State</Label>
                  <Select defaultValue={trade?.emotionalState}>
                    <SelectTrigger id="emotional-state">
                      <SelectValue placeholder="How did you feel?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="anxious">Anxious</SelectItem>
                      <SelectItem value="fearful">Fearful</SelectItem>
                      <SelectItem value="greedy">Greedy</SelectItem>
                      <SelectItem value="fomo">FOMO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="What was your thesis? What did you observe?"
                  defaultValue={trade?.notes}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Chart Image Upload</Label>
                <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                  <label htmlFor="file-upload" className="cursor-pointer block p-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload chart screenshot
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Card>

                {screenshots.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {screenshots.map((file, index) => (
                      <Card key={index} className="relative p-2 group">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          {file.name}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeScreenshot(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
            >
              Update Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};