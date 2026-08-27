import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import { UserCard } from "../../components/UserCard/UserCard.tsx";
import { UserPageContainer } from "../../components/UserPageContainer/UserPageContainer.tsx";
import { UserTabs } from "../../components/UserTabs/UserTabs.tsx";

/**
 * Placeholder UserPage (full profile is out of scope for the Header + Modals
 * task). On the current user's own page it exposes the Log out modal, matching
 * the ТЗ UserPage "Log Out" button.
 */
export const UserPage = () => {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-20">
      <Breadcrumbs currentPage="profile" />
      <h1 className="text-[28px] font-extrabold uppercase tracking-[-0.02em] md:text-[40px]">
        Profile
      </h1>
      <p className="mt-5 max-w-[450px]">
        Reveal your culinary art, share your favorite recipe and create gastronomic
        masterpieces with us.
      </p>

      <UserPageContainer sidebar={<UserCard />} content={<UserTabs />} />
    </section>
  );
};
