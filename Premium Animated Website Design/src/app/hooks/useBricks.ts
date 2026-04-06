import { useState, useEffect } from 'react';

export interface Brick {
    variant: string;
    brick_image: string;
    features: {
        [key: string]: string;
    };
    dimensions: string;
    house_images: string[];
    id: string;
    index: number;
}

const COLOR_MAP: { [key: string]: string } = {
    'BLACK': '#1A1A1A',
    'BROWN': '#5C4033',
    'RED': '#8C3027',
    'GREY': '#808080',
    'TAN': '#D2B48C',
    'CREAM': '#FFFDD0',
    'WHITE': '#F5F5F5',
    'BUFF': '#F0DC82',
    'ORANGE': '#FFA500',
    'BURGUNDY': '#800020',
    'YELLOW': '#FFFF00',
    'BEIGE': '#F5F5DC',
};

const parseColors = (colorString: string): string[] => {
    if (!colorString) return [];
    return colorString.split(',').map(s => {
        const key = s.trim().toUpperCase();
        // Handle composite keys like "TAN / BEIGE"
        if (key.includes('/')) {
            const parts = key.split('/').map(p => p.trim());
            return COLOR_MAP[parts[0]] || COLOR_MAP[parts[1]] || '#EAEAEA';
        }
        return COLOR_MAP[key] || '#EAEAEA';
    });
};

export function useBricks() {
    const [bricks, setBricks] = useState<Brick[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBricks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/bricks');
                const result = await response.json();
                if (result.success) {
                    setBricks(result.data);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Failed to fetch bricks');
            } finally {
                setLoading(false);
            }
        };

        fetchBricks();
    }, []);

    const getProductFromBrick = (brick: Brick) => ({
        id: brick.id,
        name: brick.variant,
        brand: brick.features['MATERIAL'] || 'Masonry',
        image: brick.brick_image,
        colors: parseColors(brick.features['COLOUR CLASS'] || ''),
        category: (brick.features['STYLE'] || 'Classic').split(',')[0].trim().toLowerCase()
    });

    return { bricks, loading, error, getProductFromBrick };
}

export function useBrick(id: string) {
    const [brick, setBrick] = useState<Brick | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchBrick = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bricks/${id}`);
                const result = await response.json();
                if (result.success) {
                    setBrick(result.data);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Failed to fetch brick detail');
            } finally {
                setLoading(false);
            }
        };

        fetchBrick();
    }, [id]);

    return { brick, loading, error };
}
