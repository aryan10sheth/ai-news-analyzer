import { NewsArticle } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Newspaper } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsGridProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
  isLoading?: boolean;
}

function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden hover-elevate cursor-pointer animate-pulse">
      <div className="relative h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-6 bg-muted rounded w-full" />
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
      </div>
    </Card>
  );
}

function ArticleCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  
  const readingTime = article.content 
    ? Math.max(1, Math.ceil(article.content.split(' ').length / 200))
    : 3;

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
      onClick={onClick}
      data-testid={`card-article-${article.url}`}
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        {article.urlToImage ? (
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Newspaper className="h-16 w-16 text-primary/40" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {article.source.name}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-2">
          {article.title}
        </h3>
        
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1" data-testid={`text-date-${article.url}`}>
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function NewsGrid({ articles, onArticleClick, isLoading }: NewsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4" data-testid="text-no-articles">
        <Newspaper className="h-24 w-24 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Try adjusting your search terms or check back later for new articles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard 
          key={article.url} 
          article={article} 
          onClick={() => onArticleClick(article)}
        />
      ))}
    </div>
  );
}
