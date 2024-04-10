import { Food } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'
import { isAuthorized } from '@/utils/auth'


type ResponseData = {
    result: Food[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // if(await isAuthorized(req,res)){

    // }
    const { recipe_id } = req.body
    const result = await prisma.recipe.findUnique({
        where: {
            id: recipe_id,
        },
        include: {
            ingredient: true,
            comment: {
                include: {
                    member: {
                        select: {
                            name: true,
                            image_url: true,
                            email: true,
                        },
                    },

                },
            },
            member: true,
        },
    })

    if (!result) {
        res.status(404).json({ message: 'Recipe not found' })
        return
    }

    const increaseReadCount = await prisma.recipe.update({
        where: {
            id: recipe_id,
        },
        data: {
            read_count: {
                increment: 1,
            },
        },
    })

    if (increaseReadCount) res.status(200).json(result)

    await prisma.$disconnect();

    res.end()
}