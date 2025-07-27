'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(3, {
    message: 'Search query must be at least 3 characters.',
  }),
});

export function SearchForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/search?q=${encodeURIComponent(values.query)}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-2 sm:flex-row sm:items-start"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormControl>
                <Input
                  placeholder="e.g., 'latest advancements in AI'"
                  {...field}
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="h-12 w-full sm:w-auto">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
    </Form>
  );
}
