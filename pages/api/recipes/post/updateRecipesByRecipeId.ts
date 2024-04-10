import { CreateRecipeData, Food, Ingredient, UpdateRecipeData } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { TextDecoder } from 'util';
import { prisma } from '@/utils/prisma'





export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {

        const body: UpdateRecipeData = req.body;

        const updateRecipe = await prisma.recipe.update({
            where: {
                id: Number(body.recipe_id),
            },
            data: {
                title: body.title,
                description: body.description,
                steps: body.howToSteps,
                ingredient: {
                    deleteMany: {
                        recipe_id: Number(body.recipe_id),
                    },
                    createMany: {
                        data: body.ingredients.map((ingredient: Ingredient) => ({
                            name: ingredient.name,
                            quantity: ingredient.quantity,
                            unit: ingredient.unit,
                            index: ingredient.index,
                        })),
                    },
                },
                latest_update: new Date(),
            },
        });


        await prisma.$disconnect();

        if (updateRecipe) {
            res.status(200).json(updateRecipe)
            res.end()
        }
        else {
            res.status(400).json({ message: 'Failed to update recipe' })
        }
    } else {
        res.status(405).json({ message: 'We only accept POST request' })
    }

}