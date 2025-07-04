import ServerCartView from '../components/ServerCartView';
import BackButton from '@/components/BackButton';

// Force dynamic rendering for cart page since it uses cookies/session
export const dynamic = 'force-dynamic';

export default function CartServerTestPage() {
    return (
        <div className="max-w-2xl mx-auto py-8 flex flex-col gap-6">
            <BackButton variant="default" />
            <ServerCartView />
        </div>
    );
} 