import { CreateRecipeData, Food, Ingredient, UpdateRecipeData } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import { prisma } from '@/utils/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {

        const body = req.body;

        const getRecipeInfo = await prisma.recipe.findUnique({
            where: {
                id: Number(body.recipe_id),
            }, select: {
                image_url: true,
                member: true
            }
        })

        if (getRecipeInfo?.member.email !== body.email) {
            res.status(401).json({ message: 'You are not authorized to delete this recipe' })
            return
        }

        if (getRecipeInfo?.image_url) {
            const imagePath = path.join(process.cwd(), 'public', 'images', 'recipes', getRecipeInfo.image_url);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(err)
                    res.status(400).json({ message: 'Failed to delete image' })
                    return
                }
            })
        }

        const deleteRecipeById = await prisma.recipe.delete({
            where: {
                id: Number(body.recipe_id),
            },
            include: {
                ingredient: true,
                comment: true,
            },
        });

        await prisma.$disconnect();

        if (deleteRecipeById) {
            res.status(200).json(deleteRecipeById)
            res.end()
        }
        else {
            res.status(400).json({ message: 'Failed to update recipe' })
        }
    } else {
        res.status(405).json({ message: 'We only accept POST request' })
    }

}