'use server';

import {chat as chatFlow} from '@/ai/flows/chatbot-flow';
import type {ChatRequest, ChatResponse} from '@/ai/flows/chatbot-flow';

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  return await chatFlow(request);
}
