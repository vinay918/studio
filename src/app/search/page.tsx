import { Suspense } from 'react';
import { searchYoutube } from '@/app/actions';
import ResultsPage from '@/components/ResultsPage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Youtube } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SearchResults({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Youtube className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold">YT Roundup</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Search
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <p className="mb-2 text-sm text-muted-foreground">Showing results for:</p>
        <h1 className="font-headline mb-8 truncate text-3xl font-bold">
          &quot;{query}&quot;
        </h1>
        <Suspense fallback={<ResultsSkeleton />}>
          <VideoResults query={query} />
        </Suspense>
      </main>
    </div>
  );
}

async function VideoResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">Please provide a search query.</p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Search</Link>
        </Button>
      </div>
    );
  }

  const videos = await searchYoutube(query);
  return <ResultsPage videos={videos} />;
}

function ResultsSkeleton() {
  return (
    <div>
      <div className="mb-8 flex justify-end">
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="mb-8">
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-[180px] w-full rounded-md" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
