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
            current_rating: true
        },
        orderBy: {
            posted_date: 'desc'
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