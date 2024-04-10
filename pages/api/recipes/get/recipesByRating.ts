import { Food } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    const result = await prisma.recipe.findMany({
        select: {
            id: true,
            title: true,
            image_url: true,
            current_rating: true,
            posted_date: true,
            time_spent_hh: true,
            time_spent_mm: true,
            difficulty: true,
        },
        orderBy: {
            current_rating: 'desc'
        },
    });


    if (!result) {
        res.status(404).json({ message: 'No recipes found' })
        return
    }

    await prisma.$disconnect();

    res.status(200).json(result)
    res.end()

}