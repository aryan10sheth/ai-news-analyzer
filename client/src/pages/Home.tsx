import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NewsArticle, ArticleSummary, ChatMessage } from "@shared/schema";
import { NewsGrid } from "@/components/NewsGrid";
import { SearchBar } from "@/components/SearchBar";
import { ArticleDetail } from "@/components/ArticleDetail";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Newspaper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();

  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news", searchQuery],
    queryFn: async () => {
      const query = searchQuery || "latest";
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery<ArticleSummary>({
    queryKey: ["/api/summarize", selectedArticle?.url],
    queryFn: async () => {
      if (!selectedArticle) throw new Error("No article selected");
      
      const res = await apiRequest("POST", "/api/summarize", {
        title: selectedArticle.title,
        content: selectedArticle.content || "",
        description: selectedArticle.description || "",
      });
      
      return await res.json();
    },
    enabled: !!selectedArticle,
    refetchOnWindowFocus: false,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const articleContext = `Title: ${selectedArticle?.title}\n\nContent: ${selectedArticle?.content || selectedArticle?.description || ''}`;
      
      const res = await apiRequest("POST", "/api/chat", {
        articleContext,
        message,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
      });
      
      return await res.json();
    },
    onSuccess: (data, message) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: Date.now(),
      };
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (selectedArticle) {
      setMessages([]);
    }
  }, [selectedArticle]);

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
    setMessages([]);
  };

  const handleSendMessage = (message: string) => {
    chatMutation.mutate(message);
  };

  const filteredArticles = searchQuery
    ? articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        summary={summary || null}
        isLoadingSummary={isLoadingSummary}
        messages={messages}
        onSendMessage={handleSendMessage}
        isSendingMessage={chatMutation.isPending}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="font-serif font-bold text-2xl md:text-3xl">NewsAI</h1>
            </div>
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Search news articles..."
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Latest News</h2>
          <p className="text-sm text-muted-foreground">
            {searchQuery 
              ? `Found ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''} matching "${searchQuery}"`
              : `Showing ${articles.length} recent articles`
            }
          </p>
        </div>
        
        <NewsGrid 
          articles={filteredArticles} 
          onArticleClick={handleArticleClick}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
