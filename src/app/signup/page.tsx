import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Join the studio</h1>
      <p className="mt-2 text-sm text-stone-600">Create an account to book classes.</p>
      <div className="mt-6">
        <AuthForm
          endpoint="/api/auth/signup"
          submitLabel="Create account"
          redirectTo="/"
          fields={[
            { name: "name", label: "Name", type: "text", autoComplete: "name" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            { name: "password", label: "Password (8+ characters)", type: "password", autoComplete: "new-password" },
          ]}
        />
      </div>
      <p className="mt-6 text-sm text-stone-600">
        Already a member? <Link href="/signin" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
