// the auth file should be here !!!
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { cache } from "react";
import { headers } from "next/headers";
import { db } from "../db";
import * as schema from "../db/schema";
import { admin } from "better-auth/plugins";
import {
  sendChangeEmailVerification,
  sendOrganizationInvitationEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "@/server/auth/email";
import { env } from "@/env";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ url, user, token }) {
      const resetPasswordUrl = `${env.BETTER_AUTH_URL}/reset-password?token=${token}&callbackURL=${encodeURIComponent(url)}`;

      const { error } = await sendResetPasswordEmail({
        email: user.email,
        verificationUrl: resetPasswordUrl,
      });

      if (error) return console.log("sendResetPassword Error: ", error);
    },
  },
  plugins: [
    nextCookies(),
    admin({
      adminRoles: ["super_admin"],
      defaultRole: "user",
    }),
    organization({
      async sendInvitationEmail(data, _request) {
        const inviteLink = `${env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
        const { error } = await sendOrganizationInvitationEmail({
          email: data.email,
          inviteLink: inviteLink,
          orgName: data.organization.name,
          inviteId: data.id,
        });

        if (error) {
          console.log("sendOrganizationInvitationEmail Error: ", error);
        }
      },
    }),
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }, _request) => {
        const { error } = await sendChangeEmailVerification({
          email: newEmail,
          verificationUrl: url,
        });

        if (error)
          return console.log("sendChangeEmailVerification Error: ", error);
      },
    },
  },

  emailVerification: {
    sendOnSignUp: false, // Disable sending verification emails
    expiresIn: 60 * 60 * 1, // 1 HOUR
    autoSignInAfterVerification: true,
    // Skip sending verification email - users will be auto-verified
    sendVerificationEmail: async ({ user, token, url }, request) => {
      // Skip email sending for testing - users are auto-verified
      console.log("Email verification skipped for testing purposes");
    },
  },

  socialProviders: {},
  advanced: {},
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Auto-verify all users for testing purposes
          await db
            .update(schema.users)
            .set({ emailVerified: true })
            .where(eq(schema.users.id, user.id));
          
          console.log(`Auto-verified user: ${user.email}`);
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const [member] = await db
            .select({
              organizationId: schema.members.organizationId,
            })
            .from(schema.members)
            .where(eq(schema.members.userId, session.userId))
            .limit(1)
            .execute();

          return {
            data: {
              ...session,
              activeOrganizationId: member?.organizationId,
            },
          };
        },
      },
    },
  },
});

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export type Session = typeof auth.$Infer.Session;
export type AuthUserType = Session["user"];
