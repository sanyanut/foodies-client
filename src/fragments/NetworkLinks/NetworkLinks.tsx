import { Icon } from "../../shared/Icon/Icon.tsx";

/** Social links (ТЗ): open GoIT social pages in a new tab. */
const links = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/goITclub/",
    icon: "facebook" as const,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/goitclub/",
    icon: "instagram" as const,
  },
  { name: "YouTube", href: "https://www.youtube.com/c/GoIT", icon: "youtube" as const },
];

export const NetworkLinks = () => (
  <ul className="flex items-center gap-3">
    {links.map((link) => (
      <li key={link.name}>
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.name}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray/60 bg-white text-main transition-colors hover:border-main"
        >
          <Icon name={link.icon} className="h-5 w-5" />
        </a>
      </li>
    ))}
  </ul>
);
