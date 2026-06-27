import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
    newUser: "/dashboard",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      if (account?.provider === "google" && profile?.email) {
        const dbUser = await prisma.user.upsert({
          where: { email: profile.email },
          update: {
            name: (profile as any).name,
            image: (profile as any).picture,
          },
          create: {
            email: profile.email,
            name: (profile as any).name,
            image: (profile as any).picture,
          },
        });
        token.id = dbUser.id;
        token.name = dbUser.name;
      }
      // Only refresh name from DB — never store image in JWT
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true },
        });
        if (dbUser) token.name = dbUser.name;
      }
      return token;
    },
    async session({ session, token }) {
  if (session.user && token.id) {
    session.user.id = token.id as string;
    const dbUser = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { name: true, email: true, image: true },
    });
    if (dbUser) {
      session.user.name = dbUser.name;
      session.user.email = dbUser.email;
      session.user.image = dbUser.image ?? null;
    }
  }
  return session;
},
  },
};