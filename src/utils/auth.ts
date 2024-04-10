import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"

export async function isAuthorized(req: NextApiRequest, res: any) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        return true
    } else {
        res.status(401)
        return false
    }
}