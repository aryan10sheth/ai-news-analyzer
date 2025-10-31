import { NewsArticle, ArticleSummary, ChatMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AISummaryPanel } from "./AISummaryPanel";
import { ChatbotPanel } from "./ChatbotPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ArticleDetailProps {
  article: NewsArticle;
  summary: ArticleSummary | null;
  isLoadingSummary: boolean;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSendingMessage: boolean;
  onBack: () => void;
}

export function ArticleDetail({ 
  article, 
  summary, 
  isLoadingSummary, 
  messages, 
  onSendMessage, 
  isSendingMessage,
  onBack 
}: ArticleDetailProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to articles
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left Panel - Article Content */}
          <article className="max-w-3xl">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="font-serif font-bold text-3xl md:text-4xl leading-tight" data-testid="text-article-title">
                  {article.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {article.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{timeAgo}</span>
                  </div>
                  <span className="font-medium text-primary">{article.source.name}</span>
                </div>
              </div>

              {article.urlToImage && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {article.description && (
                  <p className="text-lg leading-relaxed text-foreground font-medium mb-6">
                    {article.description}
                  </p>
                )}
                
                {article.content ? (
                  <div className="space-y-4 leading-relaxed text-foreground">
                    {article.content.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && (
                        <p key={idx} className="text-base">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      Full article content is not available. 
                    </p>
                    <Button asChild variant="default">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        data-testid="link-read-full"
                      >
                        Read full article on {article.source.name}
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {article.url && (
                <div className="pt-6 border-t">
                  <Button variant="outline" asChild>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-testid="link-source"
                    >
                      View original article
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </article>

          {/* Right Panel - Summary & Chat */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] space-y-4">
            <Tabs defaultValue="summary" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary" data-testid="button-tab-summary">AI Summary</TabsTrigger>
                <TabsTrigger value="chat" data-testid="button-tab-chat">Chat</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="flex-1 overflow-hidden mt-4">
                <AISummaryPanel 
                  summary={summary} 
                  isLoading={isLoadingSummary}
                  article={article}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="flex-1 overflow-hidden mt-4">
                <ChatbotPanel 
                  messages={messages}
                  onSendMessage={onSendMessage}
                  isSending={isSendingMessage}
                  article={article}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
