import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import { UserCard } from "../../components/UserCard/UserCard.tsx";
import { UserPageContainer } from "../../components/UserPageContainer/UserPageContainer.tsx";
import { UserTabs } from "../../components/UserTabs/UserTabs.tsx";

export const UserPage = () => {
  const { id } = useParams<{ id: string }>();

  const isPublicProfile = Boolean(id);

  // const heading = isPublicProfile ? "User" : "Profile";
  const description = isPublicProfile
    ? "Explore this chef's recipes and follow them to stay up to date."
    : "Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.";

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-20">
      {/* Breadcrumb завжди "Profile" згідно Figma */}
      <Breadcrumbs currentPage="Profile" />
      <h1 className="text-[28px] font-extrabold uppercase tracking-[-0.02em] md:text-[40px]">
        Profile
      </h1>
      <p className="mt-5 max-w-[450px]">{description}</p>

      <UserPageContainer sidebar={<UserCard />} content={<UserTabs />} />
    </section>
  );
};
