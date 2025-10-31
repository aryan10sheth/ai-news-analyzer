import { ArticleSummary, NewsArticle } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Loader2 } from "lucide-react";
import { SiGooglegemini } from "react-icons/si";

interface AISummaryPanelProps {
  summary: ArticleSummary | null;
  isLoading: boolean;
  article: NewsArticle;
}

export function AISummaryPanel({ summary, isLoading, article }: AISummaryPanelProps) {
  if (isLoading) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <p className="font-medium">Generating AI Summary...</p>
          <p className="text-sm text-muted-foreground">
            Analyzing article with Gemini AI
          </p>
        </div>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="p-6 h-full flex flex-col items-center justify-center space-y-4">
        <Sparkles className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <p className="font-medium text-muted-foreground">No summary available</p>
          <p className="text-sm text-muted-foreground">
            Unable to generate summary for this article
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full overflow-y-auto space-y-6" data-testid="card-summary">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">AI Summary</h3>
        </div>
        <Badge variant="outline" className="gap-1">
          <SiGooglegemini className="h-3 w-3" />
          Gemini
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm leading-relaxed" data-testid="text-summary-content">
            {summary.summary}
          </p>
        </div>

        {summary.keyPoints && summary.keyPoints.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Key Points
            </h4>
            <ul className="space-y-2" data-testid="list-key-points">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span className="flex-1 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{summary.readingTime} min read</span>
        </div>
      </div>
    </Card>
  );
}
