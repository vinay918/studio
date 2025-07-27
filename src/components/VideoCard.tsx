import type { Video } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Youtube } from 'lucide-react';

export function VideoCard({ video }: { video: Video }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link
        href={video.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Watch ${video.title} on YouTube`}
      >
        <div className="relative aspect-video">
          <Image
            src={video.thumbnailUrl}
            alt={`Thumbnail for ${video.title}`}
            fill
            className="object-cover"
            data-ai-hint="youtube video"
          />
        </div>
      </Link>
      <CardHeader>
        <Link
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <CardTitle className="line-clamp-2 text-lg">{video.title}</CardTitle>
        </Link>
        <CardDescription className="flex items-center pt-1">
          <Youtube className="mr-2 h-4 w-4" />
          {video.channelName}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {video.description}
        </p>
      </CardContent>
    </Card>
  );
}
