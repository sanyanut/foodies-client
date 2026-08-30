import { useAppDispatch } from "../../../store/hooks.ts";
import { closeModal, openModal } from "../../../features/ui/modalSlice.ts";
import { Modal } from "../Modal/Modal.tsx";
import { SignUpForm } from "../SignUpForm/SignUpForm.tsx";

export const SignUpModal = () => {
  const dispatch = useAppDispatch();

  return (
    <Modal onClose={() => dispatch(closeModal())} ariaLabel="Sign up">
      <h2 className="mb-8 text-[28px] font-extrabold uppercase leading-[32px] tracking-[-0.02em] text-main md:text-[40px] md:leading-[44px]">
        Sign up
      </h2>
      <SignUpForm />
      <p className="mt-6 text-center text-[14px] text-gray">
        I already have an account?{" "}
        <button
          type="button"
          onClick={() => dispatch(openModal("signin"))}
          className="font-bold text-main underline underline-offset-1"
        >
          Sign in
        </button>
      </p>
    </Modal>
  );
};
