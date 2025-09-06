import { VerifyEmailForm } from "@/modules/auth/verify-email-form";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const params = await searchParams;
  const invitationId = params.invitation as string | undefined;

  if (!session?.user) {
    return redirect("/sign-in");
  }

  // For testing: Always redirect to dashboard, skip email verification
  if (session?.user) {
    const callbackUrl = invitationId
      ? `/auth-callback?invitation=${invitationId}`
      : "/dashboard"; // Skip auth-callback and go directly to dashboard
    return redirect(callbackUrl);
  }

  // This should never be reached in testing mode
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Email Verification Skipped</h2>
        <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(() => window.location.href = '/dashboard', 1000)`
        }} />
      </div>
    </div>
  );
}
