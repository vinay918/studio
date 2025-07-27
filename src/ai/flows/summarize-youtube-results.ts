'use server';

/**
 * @fileOverview Summarizes a list of YouTube video titles and descriptions into a concise summary.
 *
 * - summarizeYoutubeResults - A function that takes a list of video titles and descriptions and returns a summary.
 * - SummarizeYoutubeResultsInput - The input type for the summarizeYoutubeResults function.
 * - SummarizeYoutubeResultsOutput - The return type for the summarizeYoutubeResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeYoutubeResultsInputSchema = z.object({
  videoInfo: z.array(
    z.object({
      title: z.string().describe('The title of the video.'),
      description: z.string().describe('The description of the video.'),
      videoUrl: z.string().url().describe('The URL of the YouTube video.'),
    })
  ).describe('An array of video titles, descriptions, and URLs to summarize.'),
});
export type SummarizeYoutubeResultsInput = z.infer<typeof SummarizeYoutubeResultsInputSchema>;

const SummarizeYoutubeResultsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the videos.'),
});
export type SummarizeYoutubeResultsOutput = z.infer<typeof SummarizeYoutubeResultsOutputSchema>;

export async function summarizeYoutubeResults(input: SummarizeYoutubeResultsInput): Promise<SummarizeYoutubeResultsOutput> {
  return summarizeYoutubeResultsFlow(input);
}

const summarizeYoutubeResultsFlow = ai.defineFlow(
  {
    name: 'summarizeYoutubeResultsFlow',
    inputSchema: SummarizeYoutubeResultsInputSchema,
    outputSchema: SummarizeYoutubeResultsOutputSchema,
  },
  async input => {
    // Dynamically build the prompt parts for each video
    const promptParts = input.videoInfo.flatMap(video => [
      { text: `Title: ${video.title}` },
      { text: `Description: ${video.description}` },
      { media: { url: video.videoUrl, contentType: 'video/mp4' } }
    ]);

    const {output} = await ai.generate({
      prompt: [
        { text: `You are an expert summarizer of YouTube videos.

You will be provided a list of videos, including their title, description, and the video content itself. Your job is to summarize the content of these videos into a single, concise summary.

Here are the videos:` },
        ...promptParts
      ],
      output: {
        schema: SummarizeYoutubeResultsOutputSchema,
      }
    });
    
    return output!;
  }
);
