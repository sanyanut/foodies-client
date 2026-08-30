import { useAppDispatch } from "../../../store/hooks.ts";
import { closeModal, openModal } from "../../../features/ui/modalSlice.ts";
import { Modal } from "../Modal/Modal.tsx";
import { SignInForm } from "../SignInForm/SignInForm.tsx";

export const SignInModal = () => {
  const dispatch = useAppDispatch();

  return (
    <Modal onClose={() => dispatch(closeModal())} ariaLabel="Sign in">
      <h2 className="mb-8 text-[28px] font-extrabold uppercase leading-[32px] tracking-[-0.02em] text-main md:text-[40px] md:leading-[44px]">
        Sign in
      </h2>
      <SignInForm />
      <p className="mt-6 text-center text-[14px] text-gray">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => dispatch(openModal("signup"))}
          className="font-bold text-main underline underline-offset-1"
        >
          Create an account
        </button>
      </p>
    </Modal>
  );
};
