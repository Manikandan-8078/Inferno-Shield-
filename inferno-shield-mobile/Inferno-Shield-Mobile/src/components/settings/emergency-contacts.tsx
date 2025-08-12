'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mockContacts } from '@/lib/mock-data';
import type { EmergencyContact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function EmergencyContacts() {
    const [contacts, setContacts] = useState<EmergencyContact[]>(mockContacts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', role: '', phone: '', email: '' }
    });

    const handleDialogOpen = (contact: EmergencyContact | null = null) => {
        setEditingContact(contact);
        if (contact) {
            form.reset(contact);
        } else {
            form.reset({ name: '', role: '', phone: '', email: '' });
        }
        setIsDialogOpen(true);
    }

    const onSubmit = (values: ContactFormValues) => {
        if (editingContact) {
            setContacts(contacts.map(c => c.id === editingContact.id ? {...c, ...values} : c));
        } else {
            setContacts([...contacts, { id: `con-${Date.now()}`, ...values }]);
        }
        setIsDialogOpen(false);
    };
    
    const handleDelete = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                 <Button onClick={() => handleDialogOpen()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Contact
                </Button>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>{contact.role}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(contact)}>
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingContact ? 'Edit' : 'Add'} Emergency Contact</DialogTitle>
                        <DialogDescription>
                            {editingContact ? 'Update the details for this contact.' : 'Add a new contact to the emergency list.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} placeholder="John Doe" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} placeholder="Building Manager" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} placeholder="555-0101" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} placeholder="john.doe@example.com" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <DialogFooter>
                                <Button type="submit">Save Contact</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
