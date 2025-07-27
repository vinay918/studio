'use server';

import {summarizeYoutubeResults} from '@/ai/flows/summarize-youtube-results';
import type {Video} from '@/lib/types';
import {z} from 'zod';

// Function to fetch from YouTube API
async function fetchYoutubeVideos(query: string): Promise<Video[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('YouTube API key is not set.');
    return [];
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&maxResults=10&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('YouTube API request failed:', response.statusText);
      const errorBody = await response.json();
      console.error('Error details:', errorBody);
      return [];
    }
    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelName: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error('Error fetching from YouTube API:', error);
    return [];
  }
}

export async function searchYoutube(query: string): Promise<Video[]> {
  console.log(`Searching YouTube for: ${query}`);
  // In a real application, you would use a scraping tool or YouTube's API here.
  // For this demo, we'll return a hardcoded list of videos.
  // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
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
