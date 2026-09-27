import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <div className="mt-6">
        <AuthForm
          endpoint="/api/auth/signin"
          submitLabel="Sign in"
          redirectTo="/bookings"
          fields={[
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
          ]}
        />
      </div>
      <p className="mt-6 text-sm text-stone-600">
        <Link href="/forgot-password" className="underline">Forgot your password?</Link> · New here?{" "}
        <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
