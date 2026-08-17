import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "./store/hooks.ts";
import { pingBackend } from "./features/health/healthSlice.ts";

interface SubscribeForm {
  email: string;
}

const statusStyles: Record<string, string> = {
  idle: "bg-gray-100 text-gray-600",
  loading: "bg-amber-100 text-amber-700",
  up: "bg-green-100 text-green-700",
  down: "bg-red-100 text-red-700",
};

// Minimal starter screen. It exercises the whole stack — Tailwind (styling),
// Redux Toolkit + thunk (backend health check), and react-hook-form (form) —
// so the scaffold is verifiably working. Real pages replace this later.
export default function App() {
  const dispatch = useAppDispatch();
  const { status, lastCheckedAt } = useAppSelector((state) => state.health);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SubscribeForm>();

  const onSubmit = (data: SubscribeForm) => {
    // Placeholder — later this hits the backend. For now just log & reset.
    console.log("subscribe:", data.email);
    reset();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-gray-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">🍳 Foodies</h1>
          <p className="text-gray-600">
            Frontend scaffold — Vite + React + TypeScript + Redux Toolkit +
            react-hook-form + Tailwind.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Backend connection</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void dispatch(pingBackend())}
              className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Checking..." : "Check backend"}
            </button>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>
          {lastCheckedAt && (
            <p className="mt-2 text-xs text-gray-400">
              Last checked: {new Date(lastCheckedAt).toLocaleTimeString()}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Newsletter (form demo)</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <span className="text-sm text-red-600">{errors.email.message}</span>
            )}
            <button
              type="submit"
              className="self-start rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-700"
            >
              Subscribe
            </button>
            {isSubmitSuccessful && (
              <span className="text-sm text-green-600">Thanks for subscribing!</span>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
