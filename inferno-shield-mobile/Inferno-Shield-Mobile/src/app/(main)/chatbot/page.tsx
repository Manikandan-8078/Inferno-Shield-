
'use client';

import {useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {chat} from '@/app/actions/chat';
import type {Message} from '@/ai/flows/chatbot-flow';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Send, Bot, User, Trash2, Paperclip, X} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';


const formSchema = z.object({
  message: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export default function ChatbotPage() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<{file: File, preview: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });

  async function onSubmit(data: FormValues) {
    if (!data.message && !image) return;

    setIsLoading(true);

    const userMessageContent = data.message;
    let imageDataUri: string | undefined = undefined;

    if (image) {
      imageDataUri = await toBase64(image.file);
    }
    
    const userMessage: Message = {
      role: 'user', 
      content: userMessageContent,
      imageUrl: image?.preview // Use preview for display
    };
    
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    form.reset();
    setImage(null);

    try {
      const response = await chat({
        history: newHistory.map(h => ({...h, imageUrl: undefined })), // Don't resend image data in history
        newMessage: userMessageContent,
        imageDataUri
      });
      setHistory([...newHistory, response.message]);
    } catch (error) {
      console.error('Error chatting with AI', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setHistory([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const preview = URL.createObjectURL(file);
        setImage({ file, preview });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Luffy AI</CardTitle>
              <CardDescription>
                Your creative and helpful collaborator. Ask me anything!
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearHistory}
                  disabled={history.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear History</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear History</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {history.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : ''
                    )}
                  >
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                           <Image
                              src={message.imageUrl}
                              alt="User upload"
                              width={200}
                              height={200}
                              className="rounded-md"
                            />
                        </div>
                      )}
                      <p>{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 text-sm bg-muted">
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
             <div className="border-t pt-4">
                {image && (
                    <div className="relative w-24 h-24 mb-2">
                        <Image
                            src={image.preview}
                            alt="Selected preview"
                            fill
                            className="object-cover rounded-md"
                        />
                         <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted text-muted-foreground"
                            onClick={handleRemoveImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-2"
                >
                  <Input
                    {...form.register('message')}
                    placeholder="Type your message..."
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*"
                  />
                  <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
             </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
