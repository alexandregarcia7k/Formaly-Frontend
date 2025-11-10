import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    provider?: string;
    providerId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Adicionar provider, providerId e tokens OAuth ao token JWT
      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar provider, providerId e tokens à sessão
      if (token && session) {
        session.provider = token.provider as string | undefined;
        session.providerId = token.providerId as string | undefined;
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
        session.expiresAt = token.expiresAt as number | undefined;
      }
      return session;
    },
  },
});
