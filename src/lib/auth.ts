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
        // Find existing user first
        const existing = await prisma.user.findUnique({
          where: { email: profile.email },
          select: { id: true, image: true },
        });

        if (existing) {
          // User already exists - update name only, NEVER touch image
          const dbUser = await prisma.user.update({
            where: { id: existing.id },
            data: { name: (profile as any).name },
          });
          token.id = dbUser.id;
          token.name = dbUser.name;
        } else {
          // Brand new user - create with Google's picture
          const dbUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: (profile as any).name,
              image: (profile as any).picture,
            },
          });
          token.id = dbUser.id;
          token.name = dbUser.name;
        }
      }

      // Refresh name + banned status from DB on every jwt call
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, banned: true },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.banned = dbUser.banned;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true, image: true, banned: true },
        });
        if (dbUser) {
          session.user.name = dbUser.name;
          session.user.email = dbUser.email;
          session.user.image = dbUser.image ?? null;
          session.user.banned = dbUser.banned;
        }
      }
      return session;
    },
  },
};