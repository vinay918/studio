'use client';

import { useState } from 'react';
import type { Video } from '@/lib/types';
import { getSummary } from '@/app/actions';
import { VideoCard } from './VideoCard';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

export default function ResultsPage({ videos }: { videos: Video[] }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');

    const videoInfo = videos.map(({ title, description }) => ({
      title,
      description,
    }));

    const result = await getSummary(videoInfo);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.summary) {
      setSummary(result.summary);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-end">
        <Button onClick={handleSummarize} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Generating...' : 'Summarize Results'}
        </Button>
      </div>

      {(summary || isLoading) && (
        <div className="mb-8 animate-in fade-in duration-500">
          <Accordion
            type="single"
            collapsible
            defaultValue="summary"
            className="w-full rounded-lg border bg-card p-4"
          >
            <AccordionItem value="summary" className="border-b-0">
              <AccordionTrigger className="py-2 text-xl font-headline hover:no-underline">
                AI Summary
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-base leading-relaxed">
                {isLoading && !summary && (
                  <p>Generating your summary, please wait...</p>
                )}
                {summary}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            No videos found for this query.
          </p>
        </div>
      )}
    </div>
  );
}
