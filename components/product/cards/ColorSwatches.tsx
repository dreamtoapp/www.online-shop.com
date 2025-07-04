'use client';

interface ColorSwatchesProps {
    colors: string[];
    onSelect?: (color: string) => void;
}

export default function ColorSwatches({ colors, onSelect }: ColorSwatchesProps) {
    if (!colors || colors.length === 0) return null;

    return (
        <div className="flex items-center gap-2 mt-1" data-analytics="swatch-list">
            {colors.map((c) => (
                <button
                    key={c}
                    className="h-5 w-5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ backgroundColor: c }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(c);
                    }}
                    aria-label={`اختيار لون ${c}`}
                    data-analytics="swatch-select"
                />
            ))}
        </div>
    );
} 