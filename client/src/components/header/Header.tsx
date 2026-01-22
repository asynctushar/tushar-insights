import Link from 'next/link';
import ThemeToggle from '../theme/ThemeToggle';
import Navbar from './Navbar';
import Search from '../search/Search';
import NotificationMenu from '../notification/NotificationMenu';
import LanguageToggle from '../language/LanguageToggle';

const Header = () => {
    return (
        <header className='bg-primary text-primary-foreground py-4 '>
            <main className='flex justify-between items-center w-7xl mx-auto'>
                <Link className="text-xl font-semibold" href="/">Tushar Insights</Link>
                <Navbar />
                <div className='flex items-center justify-between gap-4'>
                    <Search />
                    <NotificationMenu />
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </main>
        </header>
    );
};

export default Header;