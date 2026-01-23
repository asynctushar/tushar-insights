import { User } from '@/types/user.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserCardProps {
    user: User;
    time?: Date;
}

const UserCard = ({ user, time }: UserCardProps) => {
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
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${user.profilePic}`
        : undefined;

    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="text-xs">
                    {getInitials(displayName)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                    {displayName}
                </span>
                {time && (
                    <span className="text-xs text-muted-foreground">
                        {new Date(time).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default UserCard;