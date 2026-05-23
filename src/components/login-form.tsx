"use client";

import { FormEvent, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/browser-client";

type LoginFormProps = {
  initialMessage?: string;
};

export function LoginForm({ initialMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState(initialMessage ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const isEmailValid = (value: string) => /\S+@\S+\.\S+/.test(value);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!isEmailValid(email)) {
      setErrorMessage("Ingresa un correo valido");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage("No pudimos iniciar el acceso. Intenta nuevamente.");
      setIsLoading(false);
      return;
    }

    setStatusMessage("Te enviamos las instrucciones de acceso a tu correo");
    setIsLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        Correo corporativo
        <input
          type="email"
          name="email"
          placeholder="equipo@medix.com"
          autoComplete="email"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
          required
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Enviando..." : "Continuar"}
      </button>

      <p className="text-sm text-slate-600">
        Recibiras un correo para confirmar tu identidad y entrar al portal.
      </p>

      {statusMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {statusMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
