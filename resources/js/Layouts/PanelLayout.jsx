import React, { useState } from "react";
import AppLayout from "./AppLayout";
import NavbarComponent from "@/Components/Navbar";
import SidebarComponent from "@/Components/SidebarComponent";
import SuperAdminSidebar from "@/Components/SuperAdminSidebar";
import AdminSidebar from "@/Components/AdminSidebar";
import UnitHeadSidebar from "@/Components/UnitHeadSidebar";
import BottomNav from "@/Components/BottomNav";
import { useNavState, usePolicyState } from "@/States/States";
import { Head, Link, usePage, useRemember } from "@inertiajs/react";
import { useEffect } from "react";
import FeedBackModal from "@/Components/FeedBackModal";
import PolicyModal from "@/Components/PolicyModal";
import axios from "axios";
import { Toaster, toast } from "sonner";

export const LayoutType = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  UNIT_HEAD: "unit_head",
};

const Sidebar = ({ layout, isActive, activeLink, setShowFeedbackModal }) => {
  switch (layout) {
    case LayoutType.ADMIN:
      return (
        <AdminSidebar
          activeLink={activeLink}
          isActive={isActive}
          setShowFeedbackModal={setShowFeedbackModal}
        />
      );
    case LayoutType.SUPER_ADMIN:
      return (
        <SuperAdminSidebar
          activeLink={activeLink}
          isActive={isActive}
          setShowFeedbackModal={setShowFeedbackModal}
        />
      );
    case LayoutType.UNIT_HEAD:
      return (
        <UnitHeadSidebar
          activeLink={activeLink}
          isActive={isActive}
          setShowFeedbackModal={setShowFeedbackModal}
        />
      );
    default:
      return null;
  }
};

const PanelLayout = ({
  children,
  layout = null,
  headerTitle = null,
  defaultActiveLink,
  pageTitle = "",
}) => {
  const [activeLink, setActiveLink] = useState(defaultActiveLink);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { isNavActive, setNavActive } = useNavState();
  const { flash, auth, hasReadPolicy } = usePage().props;
  const [showPolicyModal, setShowPolicyModal] = useRemember(false);

  useEffect(() => {
    if (flash) {
      if (flash.message) toast(flash.message);
      else if (flash.success) toast.success(flash.success);
      else if (flash.error) toast.error(flash.error);
    }
  }, [flash]);

  useEffect(() => {
    if (!auth.user.has_read_policy) setShowPolicyModal(true);
  }, []);

  return (
    <AppLayout auth={auth}>
      <PolicyModal
        show={showPolicyModal}
        handleClose={() => setShowPolicyModal(false)}
      />
      <Head
        title={
          pageTitle ||
          headerTitle ||
          activeLink[0].toUpperCase() + activeLink.substr(1).toLowerCase()
        }
      />
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
      <NavbarComponent
        headerTitle={headerTitle || activeLink}
        setIsActive={setNavActive}
        isActive={isNavActive}
      />
      <Sidebar
        setShowFeedbackModal={setShowFeedbackModal}
        activeLink={activeLink}
        isActive={isNavActive}
        layout={auth?.role}
      />
      <main
        className={`${isNavActive ? "" : "expanded"} content-body bg-slate-100`}
      >
        {children}
      </main>
      <FeedBackModal
        show={showFeedbackModal}
        handleClose={() => setShowFeedbackModal(false)}
      />
    </AppLayout>
  );
};

export default PanelLayout;
