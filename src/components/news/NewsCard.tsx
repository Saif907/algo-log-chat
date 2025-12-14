import { useState } from "react";
import { ExternalLink, Search, Sparkles, Newspaper } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { api, NewsResult } from "@/services/api";

export const NewsCard = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsResult | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await api.news.search(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Input */}
      <Card className="p-1.5 shadow-lg border-primary/20 bg-background/60 backdrop-blur-md">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about market trends, specific stocks, or economic events..." 
              className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="h-12 px-6">
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>
      </Card>

      {/* Results Area */}
      {loading && (
        <div className="space-y-4 animate-pulse">
           <Skeleton className="h-4 w-3/4" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-5/6" />
           <div className="grid grid-cols-2 gap-4 mt-6">
             <Skeleton className="h-20 w-full rounded-xl" />
             <Skeleton className="h-20 w-full rounded-xl" />
           </div>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Main Answer */}
          <div className="prose prose-invert max-w-none">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
              <Sparkles className="w-4 h-4" /> AI Summary
            </h3>
            <div className="text-muted-foreground leading-relaxed">
               <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>
          </div>

          {/* Sources Grid */}
          {result.sources.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                <Newspaper className="w-4 h-4" /> Sources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-medium text-muted-foreground mb-1 truncate">
                        {new URL(source.url).hostname.replace('www.', '')}
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-sm font-medium leading-snug line-clamp-2">
                      {source.title || source.url}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Follow-up / Related (Optional, depends on API response) */}
          {result.related_questions && result.related_questions.length > 0 && (
             <div className="flex flex-wrap gap-2 pt-2">
                {result.related_questions.map((q, i) => (
                   <Badge 
                     key={i} 
                     variant="outline" 
                     className="cursor-pointer hover:bg-muted py-1.5 px-3"
                     onClick={() => {
                        setQuery(q);
                        handleSearch(); // Trigger search for related
                     }}
                   >
                     {q}
                   </Badge>
                ))}
             </div>
          )}

        </div>
      )}
    </div>
  );
};