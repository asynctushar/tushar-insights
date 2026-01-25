import { Button } from '@/components/ui/button';
import UserCard from '@/components/user/UserCard';
import { Comment } from '@/types/comment.type';
import { User } from '@/types/user.type';
import { Menu } from 'lucide-react';

interface CommentItemProps {
    comment: Comment;
    user?: User;
}

const CommentItem = ({ comment, user }: CommentItemProps) => {
    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <UserCard user={comment.user} time={comment.createdAt} />

                {/* it opens a menu, if(user permission is "user") then  if comment.user.documentId === user.documentId then , show "delete comment" or "delete reply"(baseed on comment.type === "normal") button on menu  otherwise no menu button */}
                {/* if user permisson is 'author' then show three option on menu, "delete comment"/"delete reply", "delete user", "ban user"/"unban user"(based on comment.user.accountStatus),  */}
                <Button>
                    <Menu />
                </Button>
            </div>
            <p>
                {comment.desc}
            </p>
            {user && (
                <div className='flex justify-end items-center'>
                    <Button>
                        Reply
                    </Button>
                </div>
            )}
            {comment.replies.length > 0 && (
                <>
                    <hr />
                    <div className='w-3/4 ms-auto'>
                        {comment.replies.map((reply) => <CommentItem comment={reply} key={reply.documentId} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default CommentItem;