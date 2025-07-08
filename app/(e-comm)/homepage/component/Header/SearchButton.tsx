import * as React from 'react';
import { Icon } from '@/components/icons/Icon';

interface SearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    'aria-label'?: string;
}

const SearchButton = React.forwardRef<HTMLButtonElement, SearchButtonProps>(
    ({ onClick, className, 'aria-label': ariaLabel = 'بحث', ...props }, ref) => (
        <button
            type="button"
            ref={ref}
            onClick={onClick}
            aria-label={ariaLabel}
            className={`flex items-center justify-center rounded-lg p-2 hover:bg-accent focus-visible:ring-2 focus-visible:ring-feature-users/50 transition-colors duration-200 ${className || ''}`}
            {...props}
        >
            <Icon name="Search" className="w-5 h-5" />
        </button>
    )
);
SearchButton.displayName = 'SearchButton';

export default React.memo(SearchButton); 