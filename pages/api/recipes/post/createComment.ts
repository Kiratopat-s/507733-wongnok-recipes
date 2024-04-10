import { CreateRecipeData, Food, Ingredient } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'

type ResponseData = {
    result: Food[]
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {

        const body: any = req.body;

        const getMemberIdByEmail = await prisma.member.findUnique({
            where: {
                email: body.member_email
            },
            select: {
                id: true
            }
        })

        if (!getMemberIdByEmail) {
            res.status(400).json({ message: 'Member not found' })
            return
        }

        const createComment = await prisma.comment.create({
            data: {
                member_id: getMemberIdByEmail.id,
                recipe_id: body.recipe_id,
                description: body.description,
                rating: body.rating,
                posted_date: new Date()
            }
        })

        if (!createComment) {
            res.status(400).json({ message: 'Failed to create comment' })
            return
        }

        // update rating for that recipe
        const getRecipeRating = await prisma.recipe.findUnique({
            where: {
                id: body.recipe_id
            },
            select: {
                current_rating: true,
                voted_count: true
            }
        })

        if (!getRecipeRating) {
            res.status(400).json({ message: 'Recipe not found' })
            return
        }

        const newRating = Number(((getRecipeRating.current_rating * getRecipeRating.voted_count + body.rating) / (getRecipeRating.voted_count + 1)).toFixed(2))

        const updateRecipeRating = await prisma.recipe.update({
            where: {
                id: body.recipe_id
            },
            data: {
                current_rating: newRating,
                voted_count: {
                    increment: 1
                }
            }
        })


        await prisma.$disconnect();

        if (updateRecipeRating) {
            res.status(200).json(createComment)
            res.end()
        }
        else {
            res.status(400).json({ message: 'Failed to create comment' })
        }
    } else {
        res.status(405).json({ message: 'We only accept POST request' })
    }

}