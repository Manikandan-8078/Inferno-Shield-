
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, FileText, History, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface SentMessage {
  timestamp: string;
  zone: string;
  message: string;
}

const messageTemplates = [
    { title: 'Evacuation', message: 'URGENT: All personnel must evacuate the building immediately. Proceed to the nearest safe exit. Do not use elevators.' },
    { title: 'Fire Drill', message: 'ATTENTION: This is a fire drill. Please follow standard evacuation procedures. This is only a test.' },
    { title: 'System Test', message: 'NOTICE: A test of the fire suppression and alert system will be conducted in the next 30 minutes.' },
    { title: 'All Clear', message: 'The recent emergency has been resolved. It is now safe to return to the building. Thank you for your cooperation.' },
    { title: 'Weather Alert', message: 'SEVERE WEATHER WARNING: Please shelter in place away from windows until further notice.' },
];

export default function MessagingPage() {
    const { toast } = useToast();
    const [zone, setZone] = useState('all');
    const [message, setMessage] = useState('');
    const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);

    const handleBroadcast = () => {
        if (!message) {
            toast({
                title: "Message Empty",
                description: "Cannot send an empty message.",
                variant: "destructive",
            });
            return;
        }

        const newMessage: SentMessage = {
            timestamp: new Date().toLocaleString(),
            zone: zone,
            message: message,
        };

        setSentMessages([newMessage, ...sentMessages]);

        toast({
            title: "Message Broadcast",
            description: `Message sent to ${zone === 'all' ? 'all zones' : `zone: ${zone}`}.`,
            variant: "default",
        });
        setMessage(''); // Clear the textarea after sending
    };
    
    const handleUseTemplate = (templateMessage: string) => {
        setMessage(templateMessage);
        // We can switch to the broadcast tab for the user here, but for now we just populate the message
        toast({
            title: "Template Loaded",
            description: "Message loaded into the composer.",
        });
    };

    return (
        <Tabs defaultValue="broadcast">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="broadcast">
                    <Send className="mr-2 h-4 w-4" />
                    Broadcast
                </TabsTrigger>
                <TabsTrigger value="history">
                     <History className="mr-2 h-4 w-4" />
                    History
                </TabsTrigger>
                <TabsTrigger value="templates">
                     <FileText className="mr-2 h-4 w-4" />
                    Templates
                </TabsTrigger>
            </TabsList>
            <TabsContent value="broadcast">
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Safety Messaging</CardTitle>
                        <CardDescription>Broadcast instructions and alerts to all personnel or specific zones.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="zone-select">Target Zone</Label>
                            <Select value={zone} onValueChange={setZone}>
                                <SelectTrigger id="zone-select">
                                    <SelectValue placeholder="Select a zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Zones</SelectItem>
                                    <SelectItem value="floor1">Floor 1</SelectItem>
                                    <SelectItem value="floor2">Floor 2</SelectItem>
                                    <SelectItem value="warehouse">Warehouse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message-input">Message</Label>
                            <Textarea
                                id="message-input"
                                placeholder="Type your message here. e.g., Evacuate immediately via the East exit."
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleBroadcast}>
                            <Send className="mr-2 h-4 w-4" />
                            Broadcast Message
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
             <TabsContent value="history">
                 <Card>
                    <CardHeader>
                        <CardTitle>Sent Message History</CardTitle>
                        <CardDescription>A log of all broadcasted communications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Timestamp</TableHead>
                                        <TableHead className="w-[150px]">Zone</TableHead>
                                        <TableHead>Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sentMessages.length > 0 ? sentMessages.map((msg, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{msg.timestamp}</TableCell>
                                            <TableCell className="capitalize">{msg.zone}</TableCell>
                                            <TableCell className="whitespace-pre-wrap">{msg.message}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                No messages sent yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                 </Card>
            </TabsContent>
             <TabsContent value="templates">
                 <Card>
                    <CardHeader>
                        <CardTitle>Message Templates</CardTitle>
                        <CardDescription>Use a template for common messages to save time.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {messageTemplates.map((template, index) => (
                            <Card key={index} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{template.title}</p>
                                    <p className="text-sm text-muted-foreground">{template.message}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template.message)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Use Template
                                </Button>
                            </Card>
                        ))}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    );
}
