import { Logo } from "../Logo/Logo.tsx";
import { NetworkLinks } from "../NetworkLinks/NetworkLinks.tsx";
import { Copyright } from "../../components/Copyright/Copyright.tsx";

/** App footer (ТЗ): Logo + NetworkLinks, with the Copyright bar below. */
export const Footer = () => (
  <footer className="bg-white">
    <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between md:px-8 lg:px-20">
      <Logo className="text-main" />
      <NetworkLinks />
    </div>
    <Copyright />
  </footer>
);
