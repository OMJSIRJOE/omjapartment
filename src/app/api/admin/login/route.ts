import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await verifyAdminCredentials(body.email, body.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createAdminSession(user.id, user.email);
    return NextResponse.json({ ok: true, email: user.email });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
