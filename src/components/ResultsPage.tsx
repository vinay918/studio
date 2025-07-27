'use client';

import { useState } from 'react';
import type { Video } from '@/lib/types';
import { getSummary, getVideoSummary } from '@/app/actions';
import { VideoCard } from './VideoCard';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Video as VideoIcon } from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';

export default function ResultsPage({ videos }: { videos: Video[] }) {
  const [summary, setSummary] = useState('');
  const [videoDataUri, setVideoDataUri] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    setSummary('');

    // Pass the full video objects to the summary function
    const result = await getSummary(videos);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error generating summary',
        description: result.error,
      });
    } else if (result.summary) {
      setSummary(result.summary);
    }

    setIsSummaryLoading(false);
  };

  const handleGenerateVideo = async () => {
    if (!summary) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please generate a summary first.',
      });
      return;
    }

    setIsVideoLoading(true);
    setVideoDataUri('');

    const result = await getVideoSummary(summary);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error generating video',
        description: result.error,
      });
    } else if (result.videoDataUri) {
      setVideoDataUri(result.videoDataUri);
    }

    setIsVideoLoading(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-end gap-4">
        <Button
          onClick={handleSummarize}
          disabled={isSummaryLoading || isVideoLoading}
          size="lg"
        >
          {isSummaryLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isSummaryLoading ? 'Generating...' : 'Summarize Results'}
        </Button>
        {summary && !videoDataUri && (
          <Button
            onClick={handleGenerateVideo}
            disabled={isSummaryLoading || isVideoLoading}
            size="lg"
            variant="secondary"
          >
            {isVideoLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <VideoIcon className="mr-2 h-4 w-4" />
            )}
            {isVideoLoading ? 'Generating Video...' : 'Generate Summary Video'}
          </Button>
        )}
      </div>

      {(summary || isSummaryLoading) && (
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
                {isSummaryLoading && !summary && (
                  <p>Generating your summary, please wait... This may take a few moments as we analyze the videos.</p>
                )}
                {summary}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {(videoDataUri || isVideoLoading) && (
        <div className="mb-8 animate-in fade-in duration-500">
          <h2 className="mb-4 text-xl font-headline">Summary Video</h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-card">
            {isVideoLoading && !videoDataUri ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Generating your video... This may take a minute.</p>
              </div>
            ) : (
              <video
                src={videoDataUri}
                controls
                className="h-full w-full"
                autoPlay
              />
            )}
          </div>
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
