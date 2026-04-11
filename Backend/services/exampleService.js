import supabase from '../config/supabase.js';
import prisma from '../config/prisma.js';

export const getAllExamples = async () => {
    // You can use Prisma to interact with your PostgreSQL db:
    try {
        // This will try to fetch from the "Example" table if it exists.
        // We will catch errors and return a mock if the table wasn't pushed yet.
        const data = await prisma.example.findMany();
        return data;
    } catch (error) {
        console.log("Prisma Example table not found, returning mock. Run `npx prisma db push` to create it.");
        return [{ id: 1, message: "Hello from Prisma Mock (Table not created yet)" }];
    }
};

export default {
    getAllExamples
};
