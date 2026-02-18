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
import { toast } from 'sonner';
import { useAppDispatch } from '@/redux/hooks';
import { addReply, banUser, removeComment, removeReply, removeUser } from '@/redux/slices/blog.slice';

interface CommentItemProps {
    comment: Comment;
    user?: User | null;
    blogSlug: string;
    blogId: string;
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

const CommentItem = ({ comment, user, blogSlug, blogId }: CommentItemProps) => {
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

    const dispatch = useAppDispatch();


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
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete comment');
            }

            dispatch(removeComment({ blogId, commentId: comment.documentId }));
            toast.success("Comment deleted successfully.");
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
            const res = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    slug: blogSlug
                })
            });
            const data = await res.json();


            if (!res.ok) {
                throw new Error(data.error || `Failed to delete ${comment.type === "normal" ? "comment" : "reply"}.`);
            }

            if (comment.type === "reply" && comment.comment) {
                dispatch(removeReply({ blogId, parentCommentId: comment.comment?.documentId, replyId: comment.documentId }));
            } else {
                dispatch(removeComment({ blogId, commentId: comment.documentId }));
            }

            toast.success(`${comment.type === "normal" ? "Comment" : "Reply"} deleted successfully.`);
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
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update user status');
            }

            const action = comment.user.accountStatus === 'banned' ? 'unbanned' : 'banned';

            dispatch(banUser({ blogId, userId: comment.user.documentId, isBanned: comment.user.accountStatus === "active" }));
            toast.success(`User ${action} successfully.`);
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
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            dispatch(removeUser({ blogId, userId: comment.user.documentId }));
            toast.success("User deleted successfully.");
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
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to post reply');
            }

            dispatch(addReply({ blogId: blogId, parentCommentId: comment.documentId, reply: data.data.reply }));
            toast.success("Reply posted successfully.");
            setReplyText('');
        } catch (error: any) {
            toast.error(error.message || "Failed to post reply.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="space-y-3">
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

                    <p className="text-sm leading-relaxed text-foreground/90">{comment.desc}</p>

                    {user && canReply && comment.type === 'normal' && !showReplyInput && (
                        <div className="flex justify-end pt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplyInput(true)}
                                className="gap-2 h-8 text-xs"
                            >
                                <Reply className="h-3.5 w-3.5" />
                                Reply
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {showReplyInput && (
                <div className="ml-6 sm:ml-12 mt-3">
                    <div className="p-4 rounded-lg bg-background border border-border">
                        <div className="space-y-3">
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
                        </div>
                    </div>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 sm:ml-12 mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            blogId={blogId}
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