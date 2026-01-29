"use client";

import { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { validateEmail } from '@/lib/validations';
import { toast } from 'sonner';
import { sendContactMessage } from '@/services/contact.service';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ name: '', email: '', message: '' });

    const validateForm = () => {
        const newErrors = { name: '', email: '', message: '' };
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        } else if (message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await sendContactMessage({ name, email, message });
            toast.success("Message sent successfully! We'll get back to you soon.");
            setName('');
            setEmail('');
            setMessage('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Hero Section */}
            <Card className="bg-muted/50 border-muted shadow-sm">
                <CardContent className="p-6 sm:p-12 space-y-2 text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Blogs</h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Get in touch for questions, feedback, or collaboration opportunities.
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-md border-0 py-6 sm:py-12">
                <CardHeader>
                    <CardTitle className="text-center text-2xl lg:text-3xl font-semibold gap-2">
                        Get In Touch
                    </CardTitle>
                </CardHeader>
                <CardContent className='px-6: sm:px-16 md:px-40 lg:px-84'>
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrors({ ...errors, name: '' });
                                    }}
                                    className="pl-10"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    className="pl-10"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Textarea
                                    id="message"
                                    placeholder="Tell us how we can help you..."
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        setErrors({ ...errors, message: '' });
                                    }}
                                    className="pl-10 min-h-32 resize-none"
                                    rows={5}
                                />
                            </div>
                            {errors.message && (
                                <p className="text-sm text-destructive">{errors.message}</p>
                            )}
                        </div>

                        <Button
                            type="button"
                            className="cursor-pointer self-start"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            {loading ? (
                                "Sending..."
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Contact;