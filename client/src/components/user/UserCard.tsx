import { User } from '@/types/user.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface UserCardProps {
    user: User;
    time?: Date;
    name?: boolean;
}

const UserCard = ({ user, time, name = true }: UserCardProps) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const displayName = user.fullName ?? user.username;
    const avatarUrl = user.profilePic
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${user.profilePic.url}`
        : undefined;

    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 border-2">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="text-xs">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
                {name && (
                    <span className="text-sm font-medium leading-none">
                        {displayName}
                        {time && user.role?.name === "author" && " (Author)"}
                    </span>
                )}
                {time && (
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(time), { addSuffix: true })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default UserCard;