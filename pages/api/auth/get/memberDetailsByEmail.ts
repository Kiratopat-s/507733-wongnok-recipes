import { CreateRecipeData, Food } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

type ResponseData = {
    result: Food[]
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        // Process a POST request
        console.log(req.body)

        const user = await prisma.member.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (user) {
            res.status(200).json(user)
        }
        else {
            res.status(404).json(null)
        }
    } else {
        res.status(405).json({ message: 'We only accept POST request' })
    }

}