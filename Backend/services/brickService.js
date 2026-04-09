import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '../data/output.json');

// Helper to slugify variant names into unique IDs
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')    // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

export const getAllBricks = async () => {
    try {
        const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
        const bricks = JSON.parse(fileContent);
        
        // Add id and slug to each brick
        return bricks.map((brick, index) => ({
            ...brick,
            id: slugify(brick.variant),
            index: index
        }));
    } catch (error) {
        console.error('Error reading bricks data:', error);
        throw new Error('Could not load brick data');
    }
};

export const getBrickById = async (id) => {
    try {
        const bricks = await getAllBricks();
        return bricks.find(brick => brick.id === id) || null;
    } catch (error) {
        console.error('Error finding brick by ID:', error);
        throw new Error('Error searching for brick');
    }
};

export default {
    getAllBricks,
    getBrickById
};
