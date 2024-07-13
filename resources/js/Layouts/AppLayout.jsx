import PageLoader from "@/Components/PageLoader";
import PolicyModal from "@/Components/PolicyModal";
import {
  useLoaderState,
  useNavState,
  usePolicyState,
  useThemeState,
  useUserAuthState,
  useWindowState,
} from "@/States/States";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";
import { Link, router, usePage, useRemember } from "@inertiajs/react";
import React, { Suspense, useEffect, useState } from "react";
import { Toaster } from "sonner";

const AppLayout = ({ children, auth }) => {
  const { theme, setTheme } = useThemeState();
  const { userAuth, setUserAuth } = useUserAuthState();
  const { showLoader, setShowLoader } = useLoaderState();
  const [showPageLoader, setShowPageLoader] = useState(true);
  const { auth: authPageProps } = usePage().props;
  const { isMobile, setIsMobile } = useWindowState();
  const { isNavActive, setNavActive } = useNavState();
  const handleResize = () => setIsMobile(window.innerWidth <= 900);
  router.on("start", () => {
    if (isMobile) {
      setNavActive(true);
    }
  });
  useEffect(() => {
    setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", () => handleResize);
    return () => window.removeEventListener("resize", () => handleResize);
  }, []);

  useEffect(() => {
    setUserAuth(authPageProps);
    setTimeout(() => {
      setShowLoader(false);
    }, 1000);
  }, []);

  useEffect(() => {
    document.querySelector("html").setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <div className="app relative" data-bs-theme={theme}>
      {!userAuth.user || userAuth.role === "unit_head" ? null : (
        // <Link
        //   href={route("admin.user_objectives")}
        //   className="bottom-10 shadow-sm hover:bg-indigo-500 left-10 fixed z-[999] bg-indigo-600 text-white px-4 py-2.5 font-semibold rounded-md"
        // >
        //   Targets
        // </Link>

        <div className="relative">
          <Fab
            mainButtonStyles={{
              background: "#0d6efd",
            }}
            style={{ position: "fixed", bottom: "5px", left: "5px" }}
            icon={<i className="fi fi-rr-location-crosshairs"></i>}
          >
            <Action
              onClick={() => {
                router.visit(route("admin.objectives.create"));
              }}
              text="Create Target"
            >
              <i class="fi fi-br-bullseye-arrow"></i>
            </Action>

            <Action
              onClick={() => {
                router.visit(route("admin.user_objectives"));
              }}
              text="Target Reviewal"
            >
              <i class="fi fi-br-book-alt"></i>
            </Action>

            <Action
              onClick={() => {
                router.visit(route("admin.user_objectives.archives"));
              }}
              text="Target Archive"
            >
              <i class="fi fi-rr-box"></i>
            </Action>

            <Action
              onClick={() => {
                router.visit(route("admin.create_submission_bin"));
              }}
              text="Create Submission Bin"
            >
              <i class="fi fi-rr-add"></i>
            </Action>

            <Action
              onClick={() => {
                router.visit(route("admin.reports.for-review"));
              }}
              text="For Review"
            >
              <i class="fi fi-rr-book-arrow-right"></i>
            </Action>

            <Action
              onClick={() => {
                router.visit(route("admin.reports.archive"));
              }}
              text="Report Archive"
            >
              <i class="fi fi-rr-folder-open"></i>
            </Action>
          </Fab>
        </div>
      )}
      <Toaster
        duration={3000}
        theme="light"
        position="bottom-right"
        toastOptions={{
          classNames: {
            error: "!text-red-500",
            success: "!text-green-500",
            warning: "!text-yellow-500",
            info: "!text-blue-500",
          },
        }}
      />
      <PageLoader show={showLoader} />
      {children}
    </div>
  );
};

export default AppLayout;
