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
        if (key.includes('/')) {
            const parts = key.split('/').map(p => p.trim());
            return COLOR_MAP[parts[0]] || COLOR_MAP[parts[1]] || '#EAEAEA';
        }
        return COLOR_MAP[key] || '#EAEAEA';
    });
};

const DUMMY_BRICKS: Brick[] = [
    {
        id: "1",
        variant: "Classic Red Extruded",
        brick_image: "https://images.unsplash.com/photo-1544288002-c9cc67eeaa05?w=500&q=80",
        features: {
            "MATERIAL": "Clay",
            "COLOUR CLASS": "RED",
            "STYLE": "Classic",
        },
        dimensions: "230 x 110 x 76 mm",
        house_images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
        index: 0
    },
    {
        id: "2",
        variant: "Rustic Ironstone Blend",
        brick_image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=500&q=80",
        features: {
            "MATERIAL": "Clay",
            "COLOUR CLASS": "BROWN, BLACK",
            "STYLE": "Rustic",
        },
        dimensions: "230 x 110 x 76 mm",
        house_images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80"],
        index: 1
    },
    {
        id: "3",
        variant: "Architectural Slate Block",
        brick_image: "https://images.unsplash.com/photo-1590483736622-398bc43be4f0?w=500&q=80",
        features: {
            "MATERIAL": "Concrete",
            "COLOUR CLASS": "GREY, BLACK",
            "STYLE": "Modern",
        },
        dimensions: "390 x 190 x 190 mm",
        house_images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
        index: 2
    },
    {
        id: "4",
        variant: "Limestone Render Veneer",
        brick_image: "https://images.unsplash.com/photo-1558284561-34bd52809f6e?w=500&q=80",
        features: {
            "MATERIAL": "Natural Stone",
            "COLOUR CLASS": "CREAM, TAN",
            "STYLE": "Architectural",
        },
        dimensions: "Random",
        house_images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
        index: 3
    },
    {
        id: "5",
        variant: "Heritage Buff Handpressed",
        brick_image: "https://images.unsplash.com/photo-1518242007639-6b5832a4e98f?w=500&q=80",
        features: {
            "MATERIAL": "Clay",
            "COLOUR CLASS": "BUFF, BEIGE",
            "STYLE": "Heritage",
        },
        dimensions: "230 x 110 x 76 mm",
        house_images: ["https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80"],
        index: 4
    }
];

export function useBricks() {
    const [bricks, setBricks] = useState<Brick[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBricks = async () => {
            try {
                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, 600));
                setBricks(DUMMY_BRICKS);
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
                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, 400));
                const found = DUMMY_BRICKS.find(b => b.id === id);
                if (found) {
                    setBrick(found);
                } else {
                    setError('Brick not found');
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
