import { SearchForm } from '@/components/SearchForm';
import { Youtube } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Youtube className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground">
            YT Roundup
          </h1>
        </div>
        <p className="mb-10 text-lg text-muted-foreground">
          Enter a query to find the top videos on YouTube, then get an instant
          AI-powered summary of all of them combined.
        </p>
        <SearchForm />
      </div>
    </main>
  );
}
