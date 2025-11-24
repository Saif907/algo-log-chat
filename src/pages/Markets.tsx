import { ChatInput } from "@/components/ChatInput";

export const Markets = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Markets</h1>
          <p className="text-xl text-muted-foreground">Market analysis coming soon</p>
        </div>
      </div>
      
      <ChatInput placeholder="Ask about market data or trading opportunities..." />
    </div>
  );
};
