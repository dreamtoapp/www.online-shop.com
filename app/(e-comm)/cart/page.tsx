import ServerCartView from './components/ServerCartView';

// Force dynamic rendering for cart page since it uses cookies/session
export const dynamic = 'force-dynamic';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <ServerCartView />
      </div>
    </div>
  );
}
