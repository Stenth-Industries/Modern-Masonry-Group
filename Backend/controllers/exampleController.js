import exampleService from '../services/exampleService.js';

export const getExamples = async (req, res) => {
    try {
        const data = await exampleService.getAllExamples();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error in getExamples:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export default {
    getExamples
};
