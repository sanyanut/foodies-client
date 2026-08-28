import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Which auth modal (if any) is currently open. Modals are opened from many
// places (Header AuthBar/UserBar, Hero, RecipeCard...), so the active modal
// lives in the store rather than in component state.
export type ModalType = "signin" | "signup" | "logout" | "update-avatar";

interface ModalState {
  activeModal: ModalType | null;
}

const initialState: ModalState = { activeModal: null };

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<ModalType>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
