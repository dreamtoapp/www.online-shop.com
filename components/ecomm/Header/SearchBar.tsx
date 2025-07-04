'use client';

import { Search, X, TrendingUp } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { iconVariants } from '@/lib/utils';

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Handle search submission here
      console.log('Searching for:', searchValue);
    }
  };

  // Popular search suggestions (you can make this dynamic)
  const popularSearches = ['هواتف ذكية', 'ملابس', 'أجهزة منزلية', 'إكسسوارات'];

  return (
    <div className="relative w-full group">
      <form
        className='relative flex w-full items-center'
        onSubmit={handleSubmit}
      >
        {/* Enhanced Input with better styling */}
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type='search'
            placeholder='ابحث عن المنتجات والفئات...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`h-11 w-full rounded-xl border-2 bg-background/80 backdrop-blur-sm pl-4 pr-20 text-sm transition-all duration-300 placeholder:text-muted-foreground/70 ${isFocused
                ? 'border-feature-users/50 bg-background shadow-lg shadow-feature-users/10 ring-2 ring-feature-users/20'
                : 'border-border/50 hover:border-border hover:bg-background/90'
              }`}
            aria-label='Search products'
          />

          {/* Search icon */}
          <div className={`absolute right-12 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-feature-users' : 'text-muted-foreground'
            }`}>
            <Search className="h-4 w-4" />
          </div>

          {/* Clear button - shows when there's text */}
          {searchValue && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleClear}
              className='absolute right-14 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-muted/80 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-200'
              aria-label='Clear search'
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Submit button with enhanced styling */}
        <Button
          type='submit'
          variant='ghost'
          size='icon'
          className={`absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg transition-all duration-300 ${isFocused
              ? 'bg-feature-users/10 text-feature-users hover:bg-feature-users/20 hover:scale-105'
              : 'text-muted-foreground hover:text-feature-users hover:bg-feature-users/10'
            }`}
          aria-label='Submit search'
        >
          <Search className={iconVariants({ size: 'sm' })} />
        </Button>
      </form>

      {/* Enhanced Search Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Popular searches header */}
          <div className="p-3 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-feature-analytics" />
              البحث الشائع
            </div>
          </div>

          {/* Suggestions list */}
          <div className="p-2">
            {popularSearches.map((search, index) => (
              <button
                key={search}
                onClick={() => {
                  setSearchValue(search);
                  setIsFocused(false);
                }}
                className="w-full text-right p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 flex items-center gap-3 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Search className="h-4 w-4 text-muted-foreground group-hover:text-feature-users transition-colors duration-200" />
                <span className="text-sm group-hover:text-accent-foreground transition-colors duration-200">
                  {search}
                </span>
              </button>
            ))}
          </div>

          {/* Quick access footer */}
          <div className="p-3 border-t border-border/50 bg-muted/20">
            <div className="text-xs text-muted-foreground text-center">
              اضغط Enter للبحث أو انقر على الاقتراحات
            </div>
          </div>
        </div>
      )}

      {/* Focus ring animation */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${isFocused
          ? 'ring-2 ring-feature-users/30 ring-offset-2 ring-offset-background'
          : ''
        }`} />
    </div>
  );
}
