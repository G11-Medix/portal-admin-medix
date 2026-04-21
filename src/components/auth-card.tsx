import Image from "next/image";
import { type ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo_medix_bg.png"
            alt="Medix"
            width={56}
            height={56}
            priority
            className="size-14 rounded-xl object-contain"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Medix Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}
