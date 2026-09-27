import AuthForm from "@/components/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mt-2 text-sm text-stone-600">We'll email you a link to choose a new one.</p>
      <div className="mt-6">
        <AuthForm
          endpoint="/api/auth/forgot-password"
          submitLabel="Send reset link"
          successMessage="Check your inbox for a reset link."
          fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
        />
      </div>
    </div>
  );
}
