import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import SidebarComponent, { NavType } from "./SidebarComponent";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import FeedBackModal from "./FeedBackModal";
import { useNavMenuLoadedState, useNavMenuState } from "@/States/States";
import NavDownloadable from "./NavDownloadable";
import NavViewable from "./NavViewable";
import ModalComponent from "./ModalComponent";
import DocViewer from "react-doc-viewer";
import { DocViewerRenderers } from "react-doc-viewer";

const AdminSidebar = ({ isActive, activeLink, setShowFeedbackModal }) => {
  const url = window.location.href;
  const [classifications, setClassifications] = useState([]);
  const { navList, setNavList } = useNavMenuState();
  const { isLoaded, setIsLoaded } = useNavMenuLoadedState();
  const { auth } = usePage().props;
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const menu = [
    {
      type: NavType.DROPDOWN,
      text: "PLAN",
      icon: <i className="fi fi-rr-document-signed"></i>,
      key: "plan",
      opened: false,
      navList: [
        ...NavViewable(setShowFileModal, setSelectedFile),
        {
          type: NavType.DROPDOWN,
          text: (
            <span>
              Downloadable <small>(ISO 9001_2015)</small>
            </span>
          ),
          icon: <i className="fi fi-rs-document"></i>,
          opened: false,
          navList: NavDownloadable(),
          key: "downloadable",
        },
        {
          type: NavType.LINK,
          text: "Calendar",
          icon: <i className="fi fi-rr-calendar"></i>,
          href: route("calendar"),
          urlPath: "calendar",
        },
        {
          type: NavType.LINK,
          text: "Announcements",
          icon: <i className="fi fi-rr-bullhorn"></i>,
          href: route("admin.announcements"),
          urlPath: "announcements",
        },
        {
          type: NavType.LINK,
          text: "Reminders",
          icon: <i className="fi fi-rr-note"></i>,
          href: route("admin.reminders"),
          urlPath: "reminders",
        },
      ],
    },
    {
      type: NavType.DROPDOWN,
      text: "DO",
      icon: <i className="fi fi-rr-calendar-lines-pen"></i>,
      key: "do",
      opened: false,
      navList: [
        {
          type: NavType.LINK,
          text: "Unit Heads Profiles",
          href: route("admin.unit_heads.profiles"),
          urlPath: "unit_heads_profiles",
        },
        {
          type: NavType.LINK,
          text: "Add Campus Admin",
          href: route("admin.admins.create"),
          urlPath: "add_campus_admin",
        },
        {
          type: NavType.LINK,
          text: "Manage Unit Heads",
          href: route("admin.unit_heads.records"),
          urlPath: "unit-heads/records",
        },
        {
          type: NavType.LINK,
          text: "Submission Bin & Targets",
          href: route("admin.submission_bins"),
          urlPath: "submission_binsk",
        },
      ],
    },
    {
      type: NavType.DROPDOWN,
      text: "CHECK",
      icon: <i className="fi fi-rr-memo-circle-check"></i>,
      key: "check",
      opened: false,
      navList: [
        {
          type: NavType.DROPDOWN,
          text: "Tracking",
          key: "tracking",
          opened: false,
          navList: [
            {
              type: NavType.LINK,
              text: "For Reviewal",
              href: route("admin.reports.for-review"),
              urlPath: "for review",
            },
          ],
        },
        {
          type: NavType.DROPDOWN,
          text: "Monitoring",
          key: "monitoring",
          opened: false,
          navList: [
            {
              type: NavType.DROPDOWN,
              text: "Tracking",
              key: "monitoring_tracking",
              opened: false,
              navList: [
                {
                  type: NavType.LINK,
                  text: "Unit Heads Report Logs",
                  href: route("admin.reports.checklist"),
                  urlPath: "reports checklist",
                },
              ],
            },
            {
              type: NavType.LINK,
              text: "User Events History",
              href: route("admin.user_events_history"),
              urlPath: "user events history",
            },
            // TODO: change to notification history link
            // {
            //   type: NavType.LINK,
            //   text: "Notification history",
            //   href: route("admin.notifications_history"),
            //   urlPath: "notification history",
            // },
            {
              type: NavType.LINK,
              text: "Feedback",
              urlPath: "feedback",
              href: route("admin.feedbacks"),
            },
          ],
        },
        {
          type: NavType.DROPDOWN,
          text: "Targets",
          key: "targets",
          opened: false,
          navList: [
            {
              type: NavType.LINK,
              text: "Reviewal",
              href: route("admin.user_objectives"),
              urlPath: "target archives",
            },
            {
              type: NavType.LINK,
              text: "Archives",
              href: route("admin.user_objectives.archives"),
              urlPath: "target archives",
            },
          ],
        },
        {
          type: NavType.DROPDOWN,
          text: "Retrieval",
          key: "retrieval",
          opened: false,
          navList: [
            {
              type: NavType.LINK,
              text: "Generated reports annually",
              href: route("admin.generated-reports"),
              urlPath: "generated reports annually",
            },
          ],
        },
      ],
    },
    {
      type: NavType.LINK,
      text: "Feedback",
      urlPath: "feedback",
      icon: <i className="fi fi-rr-comment"></i>,
      href: route("admin.feedbacks"),
    },
  ];

  useEffect(() => {
    const fetchClassifications = () => {
      axios
        .get(route("api.classifications.all"))
        .then((res) => {
          console.log(res);
          setClassifications(res.data);
          initMenu(res.data);
          setIsLoaded(true);
        })
        .catch((error) => console.log("error getting classifications ", error));
    };
    if (!isLoaded) fetchClassifications();
  }, []);

  // load document tracking nav from classifications
  const initMenu = (data) => {
    let classifications = data.classifications;
    let campusMenu = [];
    let classificationMenu = [];
    const campus = auth.user.campus;
    // classifications
    for (let classification of classifications) {
      // designations
      let designationMenu = [];
      for (let designation of classification.designations) {
        let designationNav = {
          type: NavType.LINK,
          text: designation.name,
          key: designation.name,
          urlPath: `submission_bin.reports.${campus.id}.${designation.id}`,
          href: route("admin.reports.view.filtered", {
            campus_id: campus.id,
            designation_id: designation.id,
          }),
        };
        // append designation nav
        designationMenu.push(designationNav);
      }

      let classificationNav = {
        type: NavType.DROPDOWN,
        text: classification.name,
        key: classification.id,
        active: false,
        navList: designationMenu,
        icon: <i className="fi fi-rr-brackets-square"></i>,
      };
      // append classification nav
      classificationMenu.push(classificationNav);
    }

    // nav menu
    var navMenu = {
      type: NavType.DROPDOWN,
      text: "Document Tracking",
      icon: <i className="fi fi-rs-search-alt"></i>,
      key: "document-tracking",
      active: false,
      opened: false,
      navList: [
        {
          type: NavType.LINK,
          text: "Submission Bins",
          icon: <i className="fi fi-rr-boxes"></i>,
          href: route("admin.submission_bins"),
          urlPath: "submission-bins",
        },
        {
          type: NavType.DROPDOWN,
          text: "Reports",
          icon: <i className="fi fi-rr-document"></i>,
          key: "reports",
          active: false,
          opened: false,
          navList: classificationMenu,
        },
      ],
    };

    let temp = [...menu];
    // temp[1] = navMenu;
    setNavList(temp);
    console.log("updated navbar");
  };

  return (
    <>
      <ModalComponent
        className={"rounded-0 bg-transparent"}
        bodyClassname="p-0 overflow-hidden"
        show={showFileModal}
        handleClose={() => {
          setShowFileModal((s) => !s);
        }}
        closeButton
        title={selectedFile?.name}
        size="fullscreen"
      >
        <hr className="my-1" />
        {selectedFile && (
          <DocViewer
            style={{ maxHeight: "100% !important", height: "100%" }}
            pluginRenderers={DocViewerRenderers}
            documents={[{ uri: selectedFile.uri }]}
            config={{
              zoom: 0.5,
              header: {
                disableHeader: true,
              },
            }}
            theme={{
              primary: "#5296d8",
              secondary: "#ffffff",
              tertiary: "#5296d899",
              text_primary: "#ffffff",
              text_secondary: "#5296d8",
              text_tertiary: "#00000099",
              disableThemeScrollbar: false,
            }}
          />
        )}
      </ModalComponent>
      <SidebarComponent isActive={isActive} activeLink={activeLink} />
    </>
  );
};

export default AdminSidebar;
