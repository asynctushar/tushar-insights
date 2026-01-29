"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import ConfirmDialog from '@/components/comment/ConfirmDialog';
import UserCard from '@/components/user/UserCard';
import { Comment } from '@/types/comment.type';
import { User } from '@/types/user.type';
import { MoreVertical, Trash2, UserX, Ban, Reply, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CommentItemProps {
    comment: Comment;
    user?: User;
    blogSlug: string;
}

interface openConfirmDialogProps {
    title: string;
    description: string;
    confirmText: string;
    variant?: "default" | "destructive" | "ghost" | "outline" | "secondary";
    onConfirm: () => Promise<void>;
    open?: boolean,
    isLoading?: boolean;
}

const CommentItem = ({ comment, user, blogSlug }: CommentItemProps) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<openConfirmDialogProps>({
        open: false,
        title: '',
        description: '',
        confirmText: '',
        variant: 'default',
        isLoading: false,
        onConfirm: async () => { },
    });

    const router = useRouter();

    const isAuthor = user?.role?.name === 'author';
    const isAuthorComment = comment.user.role?.name === "author";
    const isOwner = user?.documentId === comment.user.documentId;
    const canDelete = isOwner || isAuthor;
    const canReply = isAuthor;
    const showMenu = user && canDelete;

    const openConfirmDialog = ({ title, description, confirmText, variant, onConfirm }: openConfirmDialogProps) => {
        setConfirmDialog({ open: true, title, description, confirmText, variant, isLoading: false, onConfirm });
    };

    const handleDeleteComment = async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
            const endpoint = `/api/blogs/${blogSlug}/comments/${comment.documentId}`;
            const res = await fetch(endpoint, { method: 'DELETE' });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete comment');
            }

            toast.success("Comment deleted successfully.");
            router.refresh();
            setConfirmDialog(prev => ({ ...prev, open: false, isLoading: false }));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete comment.");
            setConfirmDialog(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleDeleteByAuthor = async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
            const endpoint = `/api/comments/${comment.documentId}`;
            const res = await fetch(endpoint, { method: 'DELETE' });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to delete ${comment.type === "normal" ? "comment" : "reply"}.`);
            }

            toast.success(`${comment.type === "normal" ? "Comment" : "Reply"} deleted successfully.`);
            router.refresh();
            setConfirmDialog(prev => ({ ...prev, open: false, isLoading: false }));
        } catch (error: any) {
            toast.error(error.message || `Failed to delete ${comment.type === "normal" ? "comment" : "reply"}.`);
            setConfirmDialog(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleBanUser = async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await fetch(`/api/auth/${comment.user.id}`, {
                method: 'PUT',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update user status');
            }

            const action = comment.user.accountStatus === 'banned' ? 'unbanned' : 'banned';
            toast.success(`User ${action} successfully.`);
            router.refresh();
            setConfirmDialog(prev => ({ ...prev, open: false, isLoading: false }));
        } catch (error: any) {
            toast.error(error.message || "Failed to update user status.");
            setConfirmDialog(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleDeleteUser = async () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await fetch(`/api/auth/${comment.user.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            toast.success("User deleted successfully.");
            router.refresh();
            setConfirmDialog(prev => ({ ...prev, open: false, isLoading: false }));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user.");
            setConfirmDialog(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/blogs/${blogSlug}/comments/${comment.documentId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ desc: replyText.trim() }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to post reply');
            }

            toast.success("Reply posted successfully.");
            setReplyText('');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to post reply.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Card className="shadow-sm py-4 sm:py-6">
                <CardContent className="space-y-3 px-4 sm:px-6">
                    <div className="flex justify-between items-start gap-2">
                        <UserCard user={comment.user} time={comment.createdAt} />

                        {showMenu && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className='cursor-pointer'
                                        onClick={() => openConfirmDialog({
                                            title: comment.type === "normal" ? "Delete Comment" : "Delete Reply",
                                            description: comment.type === "normal"
                                                ? "Are you sure you want to delete this comment? It will delete its associated replies as well."
                                                : "Are you sure you want to delete this reply?",
                                            confirmText: "Delete",
                                            variant: "destructive",
                                            onConfirm: isAuthor ? handleDeleteByAuthor : handleDeleteComment
                                        })}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {comment.type === "normal" ? 'Delete Comment' : "Delete Reply"}
                                    </DropdownMenuItem>

                                    {isAuthor && !isOwner && comment.type === "normal" && !isAuthorComment && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className='cursor-pointer'
                                                onClick={() => openConfirmDialog({
                                                    title: comment.user.accountStatus === 'banned' ? 'Unban User' : 'Ban User',
                                                    description: `Are you sure you want to ${comment.user.accountStatus === 'banned' ? 'unban' : 'ban'} this user?`,
                                                    confirmText: comment.user.accountStatus === 'banned' ? "Unban" : "Ban",
                                                    variant: comment.user.accountStatus === 'banned' ? "default" : "destructive",
                                                    onConfirm: handleBanUser
                                                })}
                                            >
                                                <Ban className="h-4 w-4 mr-2" />
                                                {comment.user.accountStatus === 'banned' ? 'Unban User' : 'Ban User'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => openConfirmDialog({
                                                    title: 'Delete User',
                                                    description: 'Are you sure you want to delete this user? This action cannot be undone.',
                                                    confirmText: "Delete",
                                                    variant: "destructive",
                                                    onConfirm: handleDeleteUser
                                                })}
                                                className="text-destructive focus:text-destructive cursor-pointer"
                                            >
                                                <UserX className="h-4 w-4 mr-2" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <p className="text-sm leading-relaxed">{comment.desc}</p>

                    {user && canReply && comment.type === 'normal' && !showReplyInput && (
                        <div className="flex justify-end">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => setShowReplyInput(true)}
                                className="gap-2"
                            >

                                <Reply className="h-4 w-4" />
                                Reply

                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {showReplyInput && (
                <div className="ml-8 mt-3">
                    <Card className="shadow-sm bg-muted/30 py-4 sm:py-6">
                        <CardContent className="space-y-3 px-4 sm:px-6">
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                className="min-h-20 resize-none"
                                disabled={isSubmitting}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowReplyInput(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleReply}
                                    disabled={!replyText.trim() || isSubmitting}
                                    className="gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Post Reply
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.documentId}
                            comment={reply}
                            user={user}
                            blogSlug={blogSlug}
                        />
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                description={confirmDialog.description}
                variant={confirmDialog.variant}
                confirmText={confirmDialog.confirmText}
                isLoading={confirmDialog.isLoading}
            />
        </>
    );
};

export default CommentItem;