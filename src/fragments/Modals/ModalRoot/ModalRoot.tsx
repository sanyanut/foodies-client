import { useAppSelector } from "../../../store/hooks.ts";
import { SignInModal } from "../SignInModal/SignInModal.tsx";
import { SignUpModal } from "../SignUpModal/SignUpModal.tsx";
import { LogOutModal } from "../LogOutModal/LogOutModal.tsx";

/**
 * Renders whichever auth modal is currently active in the store. Mounted once in
 * SharedLayout; each modal renders its own <Modal> wrapper.
 */
export const ModalRoot = () => {
  const active = useAppSelector((state) => state.modal.activeModal);

  if (active === "signin") return <SignInModal />;
  if (active === "signup") return <SignUpModal />;
  if (active === "logout") return <LogOutModal />;
  return null;
};
