import { User } from '@/types/user.type';

interface UserCardProps {
    user: User;
    time?: Date;
}

const UserCard = ({ user, time }: UserCardProps) => {
    return (
        <div className="flex gap-1">
            {/* shadcn avatar either with blog.user.name 2 keyword or blog.user.profilePic */}
            <div>

                <h5>
                    {user.fullName ?? user.username}
                </h5>
                {time && <span>{time.toString()}</span>}
            </div>
        </div>
    );
};

export default UserCard;