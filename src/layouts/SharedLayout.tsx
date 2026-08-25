import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Header } from "../fragments/Header/Header.tsx";
import { Footer } from "../fragments/Footer/Footer.tsx";
import { ModalRoot } from "../fragments/Modals/ModalRoot/ModalRoot.tsx";

/** Route shell (ТЗ "SharedLayout"): Header + Footer wrap nested routes, plus the
 *  global modal host and the toast notifications container. */
export const SharedLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <ModalRoot />
    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
  </div>
);
