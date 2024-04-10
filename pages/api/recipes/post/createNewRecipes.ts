import { CreateRecipeData, Food, Ingredient } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';
import { prisma } from '@/utils/prisma'

type ResponseData = {
    result: Food[]
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {

        const body: CreateRecipeData = req.body;

        // Extract the image data from the request body
        let base64Image = body.image;

        // If the image data is an ArrayBuffer, convert it to a string
        if (base64Image instanceof ArrayBuffer) {
            const decoder = new TextDecoder();
            base64Image = decoder.decode(base64Image);
        }

        // Remove the data URL prefix from the base64 image data
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // Create a buffer from the base64 data
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // change the image name to a unique name
        const imageName = `${Date.now()}.jpg`;

        // Define the path to save the image
        const imagePath = path.join(process.cwd(), 'public', 'images', 'recipes', imageName);

        // Save the image to the specified path
        fs.writeFileSync(imagePath, imageBuffer);

        const newRecipe = await prisma.recipe.create({
            data: {
                member_id: body.member_id,
                title: body.title,
                description: body.description,
                image_url: imageName,
                steps: body.howToSteps,
                ingredient: {
                    create: body.ingredients.map((ingredient: Ingredient) => ({
                        name: ingredient.name,
                        quantity: ingredient.quantity,
                        unit: ingredient.unit,
                        index: ingredient.index,
                    })),
                },
                current_rating: 0,
                time_spent_hh: body.time_spent_hh,
                time_spent_mm: body.time_spent_mm,
                difficulty: body.difficulty,
                voted_count: 0,
                read_count: 0,
                is_public: true,
                posted_date: new Date(),
                latest_update: new Date(),
            },
        });

        await prisma.$disconnect();


        res.status(200).json(newRecipe)
    } else {
        res.status(405).json({ message: 'We only accept POST request' })
    }

}