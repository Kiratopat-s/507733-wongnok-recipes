/* eslint-disable */
// eslint-disable-next-line
import type NextAuthConfig from 'next-auth';

export const authConfig: any = {
    pages: {
        signIn: '/login',
    }, callbacks: {
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
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            session.id_token = token.id_token;
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies any;
