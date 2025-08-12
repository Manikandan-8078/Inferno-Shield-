'use server';
import { generateSafetyRecommendations as generateSafetyRecommendationsFlow } from '@/ai/flows/safety-recommendations';
import type { SafetyRecommendationsInput, SafetyRecommendationsOutput } from '@/ai/flows/safety-recommendations';

export async function generateSafetyRecommendations(
  input: SafetyRecommendationsInput
): Promise<SafetyRecommendationsOutput> {
  return await generateSafetyRecommendationsFlow(input);
}
