/* ──────────────────────────────────────────────
 *  POST /api/contact
 *  Receives contact form data and sends emails
 *  via Mailtrap (admin notification + auto-reply).
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { sendContactEmail } from "@/lib/mailtrap";
import { contactSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Persist to database
    await db.contactSubmission.create({
      data: { name, email, phone: phone || null, subject, message },
    });

    await sendContactEmail({ name, email, phone: phone || "", subject, message });

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
