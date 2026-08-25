import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <section className="mx-auto flex max-w-[1440px] flex-col items-center px-4 py-24 text-center">
    <h1 className="text-[64px] font-extrabold leading-none">404</h1>
    <p className="mt-2 text-gray">Page not found</p>
    <Link
      to="/"
      className="mt-6 rounded-full bg-main px-6 py-3 text-[14px] font-bold uppercase tracking-[-0.02em] text-white transition-colors hover:bg-dark"
    >
      Go home
    </Link>
  </section>
);
