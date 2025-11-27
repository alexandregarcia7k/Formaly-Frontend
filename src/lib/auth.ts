import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    provider?: string;
    providerId?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    backendToken?: string; // JWT do backend
  }
  interface JWT {
    backendToken?: string;
  }
  interface User {
    backendToken?: string; // Token retornado pelo authorize()
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // Required for Auth.js v5
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
        const loginUrl = `${apiUrl}/api/auth/login`;

        try {
          const res = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const error = await res.json().catch(() => ({ message: "Email ou senha inválidos" }));
            throw new Error(error.message || "Email ou senha inválidos");
          }

          const data = await res.json();
          
          if (!data.user) {
            throw new Error("Resposta inválida do servidor");
          }

          // Retorna user + token do backend
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            backendToken: data.accessToken || data.access_token || data.token,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Erro ao fazer login");
        }
      },
    }),
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
    async jwt({ token, account, user }) {
      if (account && user) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;

        // Se é Credentials, o token já vem do authorize()
        if (account.provider === "credentials" && user.backendToken) {
          token.backendToken = user.backendToken;
          return token;
        }

        // Se é OAuth, precisa sincronizar com backend
        try {
          const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              providerId: account.providerAccountId || user.id,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
            }),
          });

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            token.backendToken = syncData.access_token || syncData.token || syncData.accessToken;
          }
        } catch {}
        
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session) {
        session.provider = token.provider as string | undefined;
        session.providerId = token.providerId as string | undefined;
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
        session.expiresAt = token.expiresAt as number | undefined;
        // Adiciona o JWT do backend na sessão
        session.backendToken = token.backendToken as string | undefined;
      }
      return session;
    },
  },
});
