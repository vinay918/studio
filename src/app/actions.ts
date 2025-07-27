'use server';

import { summarizeYoutubeResults } from '@/ai/flows/summarize-youtube-results';
import type { Video } from '@/lib/types';
import { z } from 'zod';

// Mock function to simulate scraping YouTube search results
export async function searchYoutube(query: string): Promise<Video[]> {
  console.log(`Searching YouTube for: ${query}`);
  // In a real application, you would use a scraping tool or YouTube's API here.
  // For this demo, we'll return a hardcoded list of videos.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return [
    {
      id: 'hYjcS_Wn3n4',
      title: 'The AI Revolution: How Machine Learning is Changing Everything',
      description: 'Explore the profound impact of artificial intelligence and machine learning on society, industry, and our daily lives. From autonomous vehicles to personalized medicine, the AI revolution is here.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Future Tech',
      videoUrl: 'https://www.youtube.com/watch?v=hYjcS_Wn3n4',
    },
    {
      id: '2l9e7p6Tf7M',
      title: 'A Beginner\'s Guide to Quantum Computing',
      description: 'Quantum computing explained in simple terms. Understand the principles of qubits, superposition, and entanglement, and how they could solve problems impossible for classical computers.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Science Simplified',
      videoUrl: 'https://www.youtube.com/watch?v=2l9e7p6Tf7M',
    },
    {
      id: 'XqZsoesa55w',
      title: 'Top 5 AI Tools You Can Use Today',
      description: 'Discover five powerful and accessible AI tools that can boost your productivity, creativity, and efficiency. We review tools for writing, image generation, coding, and more.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Productivity Hacks',
      videoUrl: 'https://www.youtube.com/watch?v=XqZsoesa55w',
    },
    {
      id: 'aNqZk0k3-Yw',
      title: 'The Ethics of Artificial Intelligence',
      description: 'A critical discussion on the ethical dilemmas posed by AI, including bias in algorithms, job displacement, and the need for regulatory frameworks to ensure responsible AI development.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Philosophy Today',
      videoUrl: 'https://www.youtube.com/watch?v=aNqZk0k3-Yw',
    },
    {
      id: 'JMUxmLyrhSk',
      title: 'How Neural Networks Work - A Visual Introduction',
      description: 'A visual and intuitive explanation of how neural networks, the backbone of deep learning, actually work. We break down neurons, layers, and backpropagation.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Deep Learning Demystified',
      videoUrl: 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
    },
    {
      id: 'I_3j3sJ_M9k',
      title: 'Building a Simple AI with Python',
      description: 'A step-by-step tutorial on building your first AI application using Python and popular libraries like TensorFlow and scikit-learn. Perfect for beginners.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Code With Me',
      videoUrl: 'https://www.youtube.com/watch?v=I_3j3sJ_M9k',
    },
    {
      id: '6_p_2B24M_c',
      title: 'Generative AI: The Art of Creating with Machines',
      description: 'Dive into the world of generative AI. See how models like GPT-3 and DALL-E 2 are creating stunning art, music, and text, and what it means for the future of creativity.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Creative Coders',
      videoUrl: 'https://www.youtube.com/watch?v=6_p_2B24M_c',
    },
    {
      id: 'Gv1_w3_KuK0',
      title: 'The Future of AI: AGI and Superintelligence',
      description: 'What comes after narrow AI? We explore the concepts of Artificial General Intelligence (AGI) and superintelligence, and the potential risks and rewards for humanity.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Existential Hope',
      videoUrl: 'https://www.youtube.com/watch?v=Gv1_w3_KuK0',
    },
    {
      id: 'zjkBMFhNj5g',
      title: 'AI in Healthcare: Saving Lives with Data',
      description: 'Discover the revolutionary applications of AI in healthcare, from diagnosing diseases earlier and more accurately to developing new drugs and personalizing treatment plans.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'Medical Marvels',
      videoUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj5g',
    },
    {
      id: 'Y6k2kS0bH0c',
      title: 'Reinforcement Learning Explained',
      description: 'An introduction to reinforcement learning, the type of machine learning that powers AlphaGo and self-driving cars. Learn about agents, environments, rewards, and policies.',
      thumbnailUrl: 'https://placehold.co/320x180.png',
      channelName: 'AI Academy',
      videoUrl: 'https://www.youtube.com/watch?v=Y6k2kS0bH0c',
    },
  ];
}

const summaryInputSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
  })
);

export async function getSummary(
  videos: { title: string; description:string; }[]
): Promise<{ summary: string } | { error: string }> {
  try {
    const validatedVideos = summaryInputSchema.parse(videos);
    const result = await summarizeYoutubeResults({ videoInfo: validatedVideos });
    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return { error: 'Invalid video data format.' };
    }
    return { error: 'Failed to generate summary.' };
  }
}
