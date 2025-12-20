import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Loader2, X, Target, ShieldAlert, Smile 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useQuery } from "@tanstack/react-query";

// Logic
import { useStrategies } from "@/hooks/use-strategies";
import { api, InstrumentType } from "@/services/api";

interface EditStrategyModalProps {
  strategyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStrategyModal = ({ strategyId, open, onOpenChange }: EditStrategyModalProps) => {
  const { updateStrategy } = useStrategies();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("📈");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  // --- Form State ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [instruments, setInstruments] = useState("");
  const [ruleGroups, setRuleGroups] = useState([
    { id: "market", name: "Market Context", rules: [] as string[] },
    { id: "entry", name: "Entry Triggers", rules: [] as string[] },
    { id: "exit", name: "Exit / Targets", rules: [] as string[] },
    { id: "risk", name: "Risk Management", rules: [] as string[] },
  ]);

  // --- 1. Fetch Full Details on Open ---
  const { data: strategy, isLoading } = useQuery({
    queryKey: ['strategy_detail', strategyId],
    queryFn: () => api.strategies.getOne(strategyId!),
    enabled: !!strategyId && open, // Only fetch when ID exists and Modal is open
  });

  // --- 2. Populate Form when Data Arrives ---
  useEffect(() => {
    if (strategy) {
      setName(strategy.name);
      setSelectedEmoji(strategy.emoji || "📈");
      setDescription(strategy.description || "");
      setStyle(strategy.style || "");
      setInstruments(strategy.instrument_types?.join(", ") || "");

      // Reconstruct Rule Groups from Backend Dictionary
      if (strategy.rules) {
        const loadedGroups = Object.entries(strategy.rules).map(([groupName, rules], index) => ({
          id: `group-${index}`,
          name: groupName,
          rules: rules as string[]
        }));
        
        // If strategy has rules, use them. Otherwise default structure.
        if (loadedGroups.length > 0) {
          setRuleGroups(loadedGroups);
        }
      }
    }
  }, [strategy]);

  // --- Helpers ---
  const addGroup = () => {
    const newId = `group-${Date.now()}`;
    setRuleGroups([...ruleGroups, { id: newId, name: "New Condition", rules: [] }]);
  };

  const deleteGroup = (groupId: string) => {
    setRuleGroups(ruleGroups.filter(g => g.id !== groupId));
  };

  const updateGroupName = (groupId: string, newName: string) => {
    setRuleGroups(ruleGroups.map(g => g.id === groupId ? { ...g, name: newName } : g));
  };

  const addRule = (groupId: string, rule: string) => {
    if (!rule.trim()) return;
    setRuleGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, rules: [...g.rules, rule] } : g
    ));
  };

  const removeRule = (groupId: string, index: number) => {
    setRuleGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, rules: g.rules.filter((_, i) => i !== index) } : g
    ));
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    setIsEmojiOpen(false);
  };

  // --- Submit Handler ---
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategyId) return;

    setIsSubmitting(true);
    
    try {
      const rulesJson: Record<string, string[]> = {};
      ruleGroups.forEach(g => {
        if (g.rules.length > 0) rulesJson[g.name] = g.rules;
      });

      const instrumentList = instruments.split(",").map(s => s.trim()).filter(Boolean) as InstrumentType[];

      await updateStrategy({
        id: strategyId,
        data: {
          name,
          emoji: selectedEmoji,
          description,
          style,
          instrument_types: instrumentList,
          rules: rulesJson
        }
      });
      
      onOpenChange(false);

    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Strategy</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
              <div className="space-y-2">
                <Label>Strategy Name *</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. ICT Silver Bullet" 
                  required 
                />
              </div>
              
              {/* Emoji Picker */}
              <div className="space-y-2 flex flex-col items-center">
                <Label>Icon</Label>
                <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-16 h-10 text-2xl px-2" type="button">
                      {selectedEmoji}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-none bg-transparent shadow-none">
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      theme={Theme.DARK} 
                      width={350}
                      height={400}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the edge..." 
              />
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Input 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g. Scalping, Swing" 
              />
            </div>

            <div className="space-y-2">
              <Label>Instruments (comma separated)</Label>
              <Input 
                value={instruments}
                onChange={(e) => setInstruments(e.target.value)}
                placeholder="STOCK, CRYPTO, FOREX" 
              />
            </div>

            {/* Dynamic Rules Section */}
            <div className="border-t border-border pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <Label className="text-base font-semibold">Rules & Checklist</Label>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addGroup}>
                  <Plus className="h-3 w-3 mr-1" /> Add Group
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {ruleGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <Input 
                        value={group.name}
                        onChange={(e) => updateGroupName(group.id, e.target.value)}
                        className="font-semibold h-8 border-transparent hover:border-input focus:border-input px-2 -ml-2 bg-transparent"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => deleteGroup(group.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {group.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-2 group/rule">
                          <ShieldAlert className="w-3 h-3 text-muted-foreground/50" />
                          <span className="flex-1 text-sm">{rule}</span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/rule:opacity-100 text-muted-foreground hover:text-destructive" onClick={() => removeRule(group.id, idx)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Input 
                        placeholder="Type a rule and hit Enter..."
                        className="h-8 text-sm mt-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRule(group.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};