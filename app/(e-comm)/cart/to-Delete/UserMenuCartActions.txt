import React from 'react';

interface UserMenuCartActionsProps {
    onClearCart: () => void;
    isClearingCart: boolean;
    getTotalItems: () => number;
}

const UserMenuCartActions: React.FC<UserMenuCartActionsProps> = ({ onClearCart, isClearingCart, getTotalItems }) => {
    return (
        <button
            className="w-full p-3 bg-destructive/10 text-destructive rounded-lg mt-2"
            onClick={onClearCart}
            disabled={isClearingCart}
        >
            {isClearingCart ? 'جاري الحذف...' : `إفراغ السلة (${getTotalItems()} عناصر)`}
        </button>
    );
};

export default UserMenuCartActions; 