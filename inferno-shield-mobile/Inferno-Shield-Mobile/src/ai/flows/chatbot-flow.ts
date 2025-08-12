'use server';

import {ai} from '@/ai/genkit';
import {generate} from 'genkit';
import {z} from 'zod';
import {
  MessageSchema,
  ChatRequestSchema,
  ChatResponseSchema,
  type ChatRequest,
} from './chatbot-types';

// Helper to construct the prompt
function buildPrompt(request: ChatRequest) {
  const history = (request.history || []).map(message => ({
    role: message.role,
    content: [{text: message.content}],
  }));

  const userContent = [];
  if (request.imageDataUri) {
    userContent.push({media: {url: request.imageDataUri}});
  }
  userContent.push({text: request.newMessage});

  return {
    history,
    messages: [{role: 'user' as const, content: userContent}],
  };
}

export const chat = ai.defineFlow(
  {
    name: 'chat',
    inputSchema: ChatRequestSchema,
    outputSchema: ChatResponseSchema,
  },
  async request => {
    const prompt = buildPrompt(request);

    const llmResponse = await generate({
      model: ai.model,
      prompt: prompt.messages,
      history: prompt.history,
    });

    const response = {
      message: {
        role: 'model' as const,
        content: llmResponse.text(),
      },
    };

    return response;
  }
);
