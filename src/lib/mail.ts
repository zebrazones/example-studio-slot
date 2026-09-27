const RESEND_URL = "https://api.resend.com/emails";

export async function sendPasswordResetEmail(to: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("RESEND_API_KEY is not configured");
    }
    console.log(`[mail] (dev) Password reset email for ${to}: ${link}`);
    return;
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "StudioSlots <no-reply@studioslots.app>",
      to,
      subject: "Reset your StudioSlots password",
      text: `Someone asked to reset the password for your StudioSlots account.\n\nReset it here: ${link}\n\nIf this wasn't you, you can ignore this email.`,
    }),
  });

  if (!res.ok) {
    console.error("[mail] Resend error", res.status, await res.text());
  }
}
