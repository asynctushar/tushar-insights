import { Suspense } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import HeaderActions from './HeaderActions';
import Logo from './Logo';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full shadow-md bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <Suspense fallback={<div className="h-6 w-64 animate-pulse bg-muted rounded" />}>
                            <DesktopNav />
                        </Suspense>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Suspense fallback={<div className="h-9 w-32 animate-pulse bg-muted rounded" />}>
                            <HeaderActions />
                        </Suspense>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden">
                        <Suspense fallback={<div className="h-9 w-9 animate-pulse bg-muted rounded" />}>
                            <MobileNav />
                        </Suspense>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;