'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI-powered safety recommendations based on incident logs.
 *
 * @fileOverview This file defines a Genkit flow for generating AI-powered safety recommendations based on incident logs.
 * @fileOverview This file defines a Genkit flow for generating AI-powered safety recommendations based on incident logs.
 * - generateSafetyRecommendations - A function that generates safety recommendations from incident data.
 * - SafetyRecommendationsInput - The input type for the generateSafetyRecommendations function.
 * - SafetyRecommendationsOutput - The return type for the generateSafetyRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafetyRecommendationsInputSchema = z.object({
  incidentLog: z.string().describe('A detailed log of the incident, including sensor data, suppression response times, and communication logs.'),
});
export type SafetyRecommendationsInput = z.infer<typeof SafetyRecommendationsInputSchema>;

const SafetyRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A list of safety recommendations based on the incident log analysis.'),
});
export type SafetyRecommendationsOutput = z.infer<typeof SafetyRecommendationsOutputSchema>;

export async function generateSafetyRecommendations(input: SafetyRecommendationsInput): Promise<SafetyRecommendationsOutput> {
  return generateSafetyRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'safetyRecommendationsPrompt',
  input: {schema: SafetyRecommendationsInputSchema},
  output: {schema: SafetyRecommendationsOutputSchema},
  prompt: `You are an AI safety analyst reviewing fire incident logs and generating safety recommendations to improve future safety measures.

Analyze the following incident log and provide a list of actionable safety recommendations.

Incident Log: {{{incidentLog}}}

Consider factors such as sensor behavior, suppression system performance, communication effectiveness, and evacuation procedures.

Provide specific and practical recommendations to enhance fire safety protocols and minimize future risks.`,
});

const generateSafetyRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateSafetyRecommendationsFlow',
    inputSchema: SafetyRecommendationsInputSchema,
    outputSchema: SafetyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
