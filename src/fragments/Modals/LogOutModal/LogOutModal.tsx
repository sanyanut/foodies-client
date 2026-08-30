import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../store/hooks.ts";
import { closeModal } from "../../../features/ui/modalSlice.ts";
import { logout } from "../../../features/auth/authSlice.ts";
import { Modal } from "../Modal/Modal.tsx";

export const LogOutModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    // logout() always resolves (client logout regardless of the server reply),
    // clearing the store + localStorage; then close the modal and go home.
    await dispatch(logout());
    dispatch(closeModal());
    navigate("/");
  };

  return (
    <Modal
      onClose={() => dispatch(closeModal())}
      maxWidthClass="max-w-[560px]"
      ariaLabel="Log out"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="mb-4 text-[28px] font-extrabold uppercase leading-[32px] tracking-[-0.02em] text-main md:text-[40px] md:leading-[44px]">
          Are you logging out?
        </h2>
        <p className="mb-8 text-[16px] text-gray">
          You can always log back in at any time.
        </p>
        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="w-full rounded-full bg-main px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-gray cursor-pointer"
          >
            {pending ? "Logging out…" : "Log out"}
          </button>
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="w-full rounded-full border border-main px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-main transition-colors hover:bg-main hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
