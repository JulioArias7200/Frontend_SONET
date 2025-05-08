import React from "react";
import { Separator } from "@/components/ui/separator";

interface TrendingTopicProps {
  category: string;
  topic: string;
  posts: string;
  showSeparator?: boolean;
}

export function TrendingTopic({ category, topic, posts, showSeparator = true }: TrendingTopicProps) {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-muted-foreground">{category} · Tendencia</p>
          <p className="font-medium">{topic}</p>
          <p className="text-xs text-muted-foreground">{posts} publicaciones</p>
        </div>
      </div>
      {showSeparator && <Separator className="my-2" />}
    </div>
  );
}