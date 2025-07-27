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
    })
  ).describe('An array of video titles and descriptions to summarize.'),
});
export type SummarizeYoutubeResultsInput = z.infer<typeof SummarizeYoutubeResultsInputSchema>;

const SummarizeYoutubeResultsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the video titles and descriptions.'),
});
export type SummarizeYoutubeResultsOutput = z.infer<typeof SummarizeYoutubeResultsOutputSchema>;

export async function summarizeYoutubeResults(input: SummarizeYoutubeResultsInput): Promise<SummarizeYoutubeResultsOutput> {
  return summarizeYoutubeResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeYoutubeResultsPrompt',
  input: {schema: SummarizeYoutubeResultsInputSchema},
  output: {schema: SummarizeYoutubeResultsOutputSchema},
  prompt: `You are an expert summarizer of YouTube video search results.

  You will be provided a list of video titles and descriptions.  Your job is to summarize the content of these videos into a single, concise summary.

  Here are the video titles and descriptions:
  {{#each videoInfo}}
  Title: {{{title}}}
  Description: {{{description}}}
  {{/each}}
  `,
});

const summarizeYoutubeResultsFlow = ai.defineFlow(
  {
    name: 'summarizeYoutubeResultsFlow',
    inputSchema: SummarizeYoutubeResultsInputSchema,
    outputSchema: SummarizeYoutubeResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
