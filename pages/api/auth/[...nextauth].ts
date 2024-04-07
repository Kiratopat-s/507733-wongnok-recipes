import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import LineProvider from "next-auth/providers/line";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }: { auth: { user: any }, request: { nextUrl: any } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async jwt({ token, user, account }: { token: any, user: any, account: any }) {
            if (account) {
                token.id_token = account.id_token;

                // Check if accessToken exists in the Member model
                const member = await prisma.member.findUnique({
                    where: {
                        email: user.email,
                    },
                });

                // If member doesn't exist, insert a new member
                if (!member) {
                    await prisma.member.create({
                        data: {
                            name: user.name,
                            email: user.email,
                            image_url: user.image,
                        },
                    });
                }
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            session.id_token = token.id_token;
            return session;
        },
    },
};
export default NextAuth(authOptions)