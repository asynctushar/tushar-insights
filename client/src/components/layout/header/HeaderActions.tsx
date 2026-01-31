"use client";

import SearchBar from '@/components/search/SearchBar';
import NotificationButton from '@/components/notification/NotificationButton';
import LanguageToggle from '@/components/language/LanguageToggle';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { User } from '@/types/user.type';

type HeaderActionsProps = {
    user?: User;
};

const HeaderActions = ({ user }: HeaderActionsProps) => {
    return (
        <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:block">
                <SearchBar />
            </div>

            {/* Mobile Search */}
            <div className="md:hidden">
                <SearchBar isMobile />
            </div>

            {/* {user && <NotificationButton />} */}
            <LanguageToggle />
            <ThemeToggle />
        </div>
    );
};

export default HeaderActions;