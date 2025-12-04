import { ChatInput } from "@/components/ChatInput";

export const Analytics = () => {
  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Analytics</h1>
          <p className="text-xl text-muted-foreground">Advanced analytics coming soon</p>
        </div>
      </div>
      
      <ChatInput placeholder="Ask about your analytics or performance metrics..." />
    </div>
  );
};
