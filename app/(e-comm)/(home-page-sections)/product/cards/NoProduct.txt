export default function NoProduct() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7l1.664 12.03A2 2 0 006.655 21h10.69a2 2 0 001.991-1.97L21 7M3 7l1.664 12.03A2 2 0 006.655 21h10.69a2 2 0 001.991-1.97L21 7M9 11v6m6-6v6" />
            </svg>
            <span>لا توجد منتجات متاحة حالياً</span>
        </div>
    );
} 