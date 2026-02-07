import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] animate-in fade-in duration-300">
            <Spinner className='w-8 h-8' />
        </div>
    );
}