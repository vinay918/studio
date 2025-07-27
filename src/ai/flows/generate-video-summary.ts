'use server';

/**
 * @fileOverview Generates a video summary from a text prompt using the Veo model.
 *
 * - generateVideoSummary - A function that takes a text summary and returns a video data URI.
 * - GenerateVideoSummaryInput - The input type for the generateVideoSummary function.
 * - GenerateVideoSummaryOutput - The return type for the generateVideoSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MediaPart} from 'genkit';

const GenerateVideoSummaryInputSchema = z.object({
  summary: z.string().describe('The text summary to generate a video from.'),
});
export type GenerateVideoSummaryInput = z.infer<
  typeof GenerateVideoSummaryInputSchema
>;

const GenerateVideoSummaryOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The generated video as a data URI. Expected format: 'data:video/mp4;base64,<encoded_data>'."
    ),
});
export type GenerateVideoSummaryOutput = z.infer<
  typeof GenerateVideoSummaryOutputSchema
>;

export async function generateVideoSummary(
  input: GenerateVideoSummaryInput
): Promise<GenerateVideoSummaryOutput> {
  return generateVideoSummaryFlow(input);
}

async function toBase64(video: MediaPart): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  // Add API key before fetching the video.
  const videoDownloadResponse = await fetch(
    `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  const buffer = await videoDownloadResponse.buffer();
  return buffer.toString('base64');
}

const generateVideoSummaryFlow = ai.defineFlow(
  {
    name: 'generateVideoSummaryFlow',
    inputSchema: GenerateVideoSummaryInputSchema,
    outputSchema: GenerateVideoSummaryOutputSchema,
  },
  async input => {
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: `Create a short, visually engaging video that summarizes the following text. Use dynamic visuals, stock footage, and motion graphics to illustrate the key points.

Text: "${input.summary}"`,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    const base64Video = await toBase64(video);

    return {
      videoDataUri: `data:video/mp4;base64,${base64Video}`,
    };
  }
);
