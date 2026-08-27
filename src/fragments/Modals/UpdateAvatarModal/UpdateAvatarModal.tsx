import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { closeModal } from "../../../features/ui/modalSlice.ts";
import { updateAvatar } from "../../../features/user/userSlice.ts";
import { updateUserAvatar } from "../../../features/auth/authSlice.ts";
import { Modal } from "../Modal/Modal.tsx";
import type { RootState } from "../../../store/store.ts";
// import { AVATAR_MOT_FOUND_IMG } from "../../../shared/constants.ts";

export const UpdateAvatarModal = () => {
  const dispatch = useAppDispatch();
  const avatarStatus = useAppSelector((state: RootState) => state.user.avatarStatus);
  // Поточний аватар юзера з auth стейту (або fallback константа)
  // const currentAvatar = useAppSelector(
  //   (state: RootState) => state.auth.user?.avatar ?? AVATAR_MOT_FOUND_IMG,
  // );

  // Посилання на прихований input[type="file"]
  const inputRef = useRef<HTMLInputElement>(null);
  // Локальний preview вибраного фото (ще не завантажено)
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isPending = avatarStatus === "loading";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    // Створюємо локальний URL для прев'ю без відправки на сервер
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    const result = await dispatch(updateAvatar(selectedFile));
    if (updateAvatar.fulfilled.match(result)) {
      // Оновлюємо аватар і в auth.user → хедер одразу показує нове фото
      dispatch(updateUserAvatar(result.payload));
      dispatch(closeModal());
    }
  };

  return (
    <Modal
      onClose={() => dispatch(closeModal())}
      maxWidthClass="max-w-[440px]"
      ariaLabel="Update profile photo"
    >
      <div className="flex flex-col items-center text-center gap-6">
        <h2 className="text-[28px] font-extrabold uppercase leading-tight tracking-[-0.02em] text-main">
          Update photo
        </h2>

        {/* До вибору файлу — '+', після — прев'ю */}
        <div
          onClick={() => inputRef.current?.click()}
          className="h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-gray-300 hover:border-black transition-colors flex items-center justify-center bg-gray-50"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl text-gray-300">+</span>
          )}
        </div>

        {/* Прихований input для вибору файлу */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Кнопка вибору файлу (відкриває input) */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-semibold text-gray-500 underline hover:text-black transition-colors"
        >
          {preview ? "Choose another photo" : "Choose photo"}
        </button>

        {/* Помилка якщо запит провалився */}
        {avatarStatus === "failed" && (
          <p className="text-sm text-red-500">Failed to upload. Please try again.</p>
        )}

        {/* Кнопки дій */}
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isPending}
            className="w-full rounded-full bg-main px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="w-full rounded-full border border-main px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-main transition-colors hover:bg-main hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
