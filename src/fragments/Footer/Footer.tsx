import { Logo } from "../Logo/Logo.tsx";
import { NetworkLinks } from "../NetworkLinks/NetworkLinks.tsx";
import { Copyright } from "../../components/Copyright/Copyright.tsx";
import { Container } from "../../components/Container/Container.tsx";

/** App footer (ТЗ): Logo + NetworkLinks, with the Copyright bar below. */
export const Footer = () => (
  <footer className="bg-white">
    <Container className="flex flex-col items-center gap-6 py-10 md:flex-row md:justify-between">
      <Logo className="text-main" />
      <NetworkLinks />
    </Container>
    <Copyright />
  </footer>
);
