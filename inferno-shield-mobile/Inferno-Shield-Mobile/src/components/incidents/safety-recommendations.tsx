'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, BotMessageSquare } from 'lucide-react';
import type { Incident } from '@/lib/types';
import { generateSafetyRecommendations } from '@/app/actions/generate-recommendations';
import { Skeleton } from '../ui/skeleton';

export function SafetyRecommendations({ incident }: { incident: Incident }) {
  const [recommendations, setRecommendations] = useState(incident.recommendations || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations('');

    try {
      const result = await generateSafetyRecommendations({ incidentLog: incident.log });
      if (result.recommendations) {
        setRecommendations(result.recommendations);
      } else {
        setError('Failed to generate recommendations. The AI returned an empty response.');
      }
    } catch (e) {
      setError('An error occurred while generating recommendations.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>AI-Powered Safety Recommendations</CardTitle>
                <CardDescription>Analyze the incident log to generate safety improvements.</CardDescription>
            </div>
            <form onSubmit={handleSubmit}>
                <Button type="submit" disabled={isLoading}>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    {isLoading ? 'Analyzing...' : 'Generate Recommendations'}
                </Button>
            </form>
        </div>
      </CardHeader>
      <CardContent className="min-h-[6rem]">
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {recommendations && (
            <div className="text-sm bg-secondary p-4 rounded-md">
                <div className="flex items-start gap-3">
                    <BotMessageSquare className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <p className="whitespace-pre-wrap text-secondary-foreground">{recommendations}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
