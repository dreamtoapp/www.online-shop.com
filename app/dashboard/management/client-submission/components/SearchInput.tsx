import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
    <input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className='border border-muted rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary text-sm'
        aria-label='بحث'
    />
);

export default SearchInput; 