import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server-client";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("message", "El enlace no es valido o expiro");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("message", "El enlace no es valido o expiro");
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
