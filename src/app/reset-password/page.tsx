import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <p className="text-stone-600">
        This link is missing its token. <Link href="/forgot-password" className="underline">Request a new one.</Link>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      <div className="mt-6">
        <AuthForm
          endpoint="/api/auth/reset-password"
          submitLabel="Save password"
          redirectTo="/bookings"
          extra={{ token }}
          fields={[{ name: "password", label: "New password (8+ characters)", type: "password", autoComplete: "new-password" }]}
        />
      </div>
    </div>
  );
}
