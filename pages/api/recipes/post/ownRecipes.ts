import { Food } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/utils/prisma'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    const { member_email } = req.body

    const member = await prisma.member.findUnique({
        where: {
            email: member_email
        },
        select: {
            id: true
        }
    });

    if (!member) {
        res.status(404).json({ message: 'Member not found' });
        return;
    }

    // Continue with your code...

    const result = await prisma.recipe.findMany({
        select: {
            id: true,
            title: true,
            image_url: true,
            current_rating: true
        },
        orderBy: {
            current_rating: 'desc'
        },
        where: {
            member_id: member.id
        },
    });

    await prisma.$disconnect();

    res.status(200).json(result)
    res.end()

}