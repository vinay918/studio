'use server';

import {generateVideoSummary} from '@/ai/flows/generate-video-summary';
import {summarizeYoutubeResults} from '@/ai/flows/summarize-youtube-results';
import type {Video} from '@/lib/types';
import {z} from 'zod';
import yts from 'yt-search';

async function fetchYoutubeVideos(query: string): Promise<Video[]> {
  try {
    const {videos} = await yts(query);
    return videos.slice(0, 10).map(video => ({
      id: video.videoId,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnail,
      channelName: video.author.name,
      videoUrl: video.url,
    }));
  } catch (error) {
    console.error('Error fetching from YouTube API:', error);
    return [];
  }
}

export async function searchYoutube(query: string): Promise<Video[]> {
  console.log(`Searching YouTube for: ${query}`);
  return fetchYoutubeVideos(query);
}

const summaryInputSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
  })
);

export async function getSummary(
  videos: {title: string; description: string}[]
): Promise<{summary: string} | {error: string}> {
  try {
    const validatedVideos = summaryInputSchema.parse(videos);
    const result = await summarizeYoutubeResults({videoInfo: validatedVideos});
    return {summary: result.summary};
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return {error: 'Invalid video data format.'};
    }
    return {error: 'Failed to generate summary.'};
  }
}

const videoSummaryInputSchema = z.object({
  summary: z.string(),
});

export async function getVideoSummary(
  summary: string
): Promise<{videoDataUri: string} | {error: string}> {
  try {
    const validatedInput = videoSummaryInputSchema.parse({summary});
    const result = await generateVideoSummary({summary: validatedInput.summary});
    return {videoDataUri: result.videoDataUri};
  } catch (e) {
    console.error(e);
    return {error: 'Failed to generate video summary.'};
  }
}
