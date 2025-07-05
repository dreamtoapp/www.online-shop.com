import React from 'react';

const ReplyCountBadge: React.FC<{ count: number }> = ({ count }) => {
    if (!count) return null;
    return (
        <span className='ml-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-sm border border-background'>
            {count}
        </span>
    );
};

export default ReplyCountBadge; 