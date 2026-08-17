import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./store.ts";

// Pre-typed versions of the plain react-redux hooks. Use these throughout the
// app instead of the untyped originals.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
