import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    jwt({ token, user }) {
      // On initial sign-in, user object is available — persist the DB id in the token
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // Use the persisted DB id from the token (not token.sub which may differ)
        session.user.id = (token.id as string) ?? token.sub!;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
