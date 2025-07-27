'use server';

/**
 * @fileOverview Summarizes a YouTube video's title and description into a concise summary.
 *
 * - summarizeYoutubeResults - A function that takes a video's title and description and returns a summary.
 * - SummarizeYoutubeVideoInput - The input type for the summarizeYoutubeVideo function.
 * - SummarizeYoutubeVideoOutput - The return type for the summarizeYoutubeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeYoutubeVideoInputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video.'),
  videoUrl: z.string().url().describe('The URL of the YouTube video.'),
});
export type SummarizeYoutubeVideoInput = z.infer<
  typeof SummarizeYoutubeVideoInputSchema
>;

const SummarizeYoutubeVideoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video.'),
});
export type SummarizeYoutubeVideoOutput = z.infer<
  typeof SummarizeYoutubeVideoOutputSchema
>;

export async function summarizeYoutubeVideo(
  input: SummarizeYoutubeVideoInput
): Promise<SummarizeYoutubeVideoOutput> {
  return summarizeYoutubeVideoFlow(input);
}

const summarizeYoutubeVideoFlow = ai.defineFlow(
  {
    name: 'summarizeYoutubeVideoFlow',
    inputSchema: SummarizeYoutubeVideoInputSchema,
    outputSchema: SummarizeYoutubeVideoOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: [
        {
          text: `You are an expert summarizer of YouTube videos.

You will be provided a video, including its title, description, and the video content itself. Your job is to summarize the content of this video into a single, concise summary.

Here is the video:`,
        },
        {text: `Title: ${input.title}`},
        {text: `Description: ${input.description}`},
        {media: {url: input.videoUrl, contentType: 'video/mp4'}},
      ],
      output: {
        schema: SummarizeYoutubeVideoOutputSchema,
      },
    });

    return output!;
  }
);
