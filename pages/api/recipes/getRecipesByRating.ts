import { Food } from '@/interface/recipes'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    result: Food[]
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const food: Food[] = [
        {
            id: 1,
            name: "กระเพราหมูสับ",
            rating: 4.5,
            src: "/images/recipes/reciepe_1.webp",
        },
        {
            id: 2,
            name: "แพนงหมู",
            rating: 4.6,
            src: "/images/recipes/reciepe_1.webp",
        },
        {
            id: 3,
            name: "ต้มยำกุ้ง",
            rating: 4.1,
            src: "/images/recipes/reciepe_1.webp",
        },
    ]
    res.status(200).json({ result: food })
}