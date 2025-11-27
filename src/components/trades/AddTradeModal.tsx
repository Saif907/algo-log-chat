import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeModal = ({ open, onOpenChange }: AddTradeModalProps) => {
  const { toast } = useToast();
  const [screenshots, setScreenshots] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshots([...screenshots, ...Array.from(e.target.files)]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Trade added successfully",
      description: "Your trade has been logged and is ready for analysis.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-background z-10 p-6 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold">Add New Trade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Trade Details</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input id="symbol" placeholder="e.g., TSLA, BANKNIFTY" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direction">Direction *</Label>
                  <Select required>
                    <SelectTrigger id="direction">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Account *</Label>
                  <Select required>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="td">TD Ameritrade</SelectItem>
                      <SelectItem value="zerodha">Zerodha</SelectItem>
                      <SelectItem value="robinhood">Robinhood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrument">Instrument *</Label>
                  <Select required>
                    <SelectTrigger id="instrument">
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry">Entry Price *</Label>
                  <Input id="entry" type="number" step="0.01" placeholder="0.00" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit">Exit Price *</Label>
                  <Input id="exit" type="number" step="0.01" placeholder="0.00" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input id="quantity" type="number" placeholder="0" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryDate">Entry Date *</Label>
                  <Input id="entryDate" type="datetime-local" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exitDate">Exit Date *</Label>
                  <Input id="exitDate" type="datetime-local" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fees">Fees & Commissions</Label>
                  <Input id="fees" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="playbook">Playbook</Label>
                  <Select>
                    <SelectTrigger id="playbook">
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
                  <Label htmlFor="emotion">Emotion</Label>
                  <Select>
                    <SelectTrigger id="emotion">
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
                <Label htmlFor="notes">Trade Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="What was your thesis? What did you observe?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mistakes">Mistakes (if any)</Label>
                <Textarea
                  id="mistakes"
                  placeholder="What could you have done better?"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Screenshots</Label>
                <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors">
                  <label htmlFor="file-upload" className="cursor-pointer block p-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload screenshots
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB each
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
            </TabsContent>
          </Tabs>

          <div className="sticky bottom-0 bg-background border-t border-border/50 pt-4 flex flex-col sm:flex-row gap-3 justify-end">
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
              className="w-full sm:w-auto bg-[#00d4ff] hover:bg-[#00b8e0] text-black"
            >
              Save Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
