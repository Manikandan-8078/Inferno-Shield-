
import {z} from 'genkit';

export const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
  imageUrl: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChatRequestSchema = z.object({
  history: z.array(MessageSchema),
  newMessage: z.string(),
  imageDataUri: z.string().optional(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  message: MessageSchema,
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
