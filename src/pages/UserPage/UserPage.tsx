import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";

/**
 * Placeholder UserPage (full profile is out of scope for the Header + Modals
 * task). On the current user's own page it exposes the Log out modal, matching
 * the ТЗ UserPage "Log Out" button.
 */
export const UserPage = () => {
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:px-20">
      <h1 className="text-[28px] font-extrabold uppercase tracking-[-0.02em] md:text-[40px]">
        Profile
      </h1>
      <p className="mt-4 text-gray">User id: {id}</p>
      {user?.id === id && (
        <button
          type="button"
          onClick={() => dispatch(openModal("logout"))}
          className="mt-6 rounded-full border border-main px-6 py-3 text-[14px] font-bold uppercase tracking-[-0.02em] transition-colors hover:bg-main hover:text-white"
        >
          Log out
        </button>
      )}
      <p className="mt-16 text-[13px] text-gray">
        UserPage — placeholder (out of scope for Header + Modals).
      </p>
    </section>
  );
};
