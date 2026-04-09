import brickService from '../services/brickService.js';

export const getAllBricks = async (req, res) => {
    try {
        const data = await brickService.getAllBricks();
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        console.error('Error in getAllBricks controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBrickById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await brickService.getBrickById(id);
        
        if (!data) {
            return res.status(404).json({ success: false, message: 'Brick not found' });
        }
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getBrickById controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    getAllBricks,
    getBrickById
};
