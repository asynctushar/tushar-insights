"use client";

import { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
        <div className="container min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

            {/* Hero Section */}
            <div className="relative space-y-3 pb-8 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
                    <span className="inline-block w-6 h-px bg-primary" />
                    Contact
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Get In Touch</h1>
                <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                    Get in touch for questions, feedback, or collaboration opportunities.
                </p>
            </div>

            {/* Form + Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Info Sidebar */}
                <div className="lg:col-span-1 lg:sticky lg:top-24">
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Contact Info</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Have a question or want to collaborate? Fill out the form and I'll get back to you as soon as possible.
                            </p>
                            <div className="border-t border-border pt-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-foreground/70">Email response within 24h</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-foreground/70">Open to collaborations</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest">Send a Message</h3>
                        </div>
                        <div className="p-6 flex flex-col gap-5">

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setErrors({ ...errors, name: '' });
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors({ ...errors, email: '' });
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us how we can help you..."
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);
                                            setErrors({ ...errors, message: '' });
                                        }}
                                        className="pl-9 min-h-32 resize-none"
                                        rows={5}
                                    />
                                </div>
                                {errors.message && (
                                    <p className="text-xs text-destructive">{errors.message}</p>
                                )}
                            </div>

                            <div className="border-t border-border pt-4">
                                <Button
                                    type="button"
                                    className="cursor-pointer"
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

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;