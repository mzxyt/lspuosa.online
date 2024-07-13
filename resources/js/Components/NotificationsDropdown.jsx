import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Nav, NavItem } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { toast } from "sonner";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const { auth } = usePage().props;

  const unitHeadNotifs = ["notification.unitHead", "report.status.updated"];

  const adminNotifs = ["notification.admin"];

  const superAdminNotifs = ["new.report.approved"];

  const getNotifications = () => {
    axios.get(route(`notifications.general`, auth.user.id)).then((res) => {
      console.log("notifs: ", res);
      setNotifications(res.data.notifications);
    });
  };
  useEffect(() => {
    getNotifications();
    Echo.private("users." + auth.user.id).notification((notification) => {
      console.log("notiifcation recieved: ", notification);
      getNotifications();
      // if (auth.role == 'unit_head' && unitHeadNotifs.includes(notification.type)) {
      //     getNotifications();
      // }
      // else if (auth.role == 'admin' && notification.type === 'notification.admin') {
      //     getNotifications();
      // }
    });
  }, []);

  const NotifIcon = ({ data }) => (
    <>
      {data.type == "submission_bin" ? (
        <i className="fi fi-rr-box text-xl leading-none"></i>
      ) : (
        <i className="fi fi-rr-document text-xl leading-none"></i>
      )}
    </>
  );

  const markAsRead = () => {
    axios
      .patch(route("notifications.read.general", auth.user.id))
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          let count = notifications.length;
          toast.success(
            count +
              (count > 1 ? " items were" : " item was") +
              " marked as read!"
          );
          setNotifications([]);
        }
      });
  };

  return (
    <>
      <Dropdown as={NavItem} className="dropdown-expand" align="end">
        <DropdownToggle
          bsPrefix="nav-profile-toggler"
          className="cursor-pointer btn btn-link nav-link bg-transparent text-decoration-none"
        >
          <div className="c-icon my-0 position-relative">
            <i className="fi fi-rr-bell text-[1.1rem] text-dark leading-none  my-0"></i>
            {notifications.length > 0 && (
              <div className="blob bg-primary absolute top-[-3px] end-0"></div>
            )}
          </div>
        </DropdownToggle>
        <Dropdown.Menu className="shadow-md shadow-black/[0.05]">
          <div className="px-3">
            <div className="flex items-center">
              <div className="text-center text-sm w-[10rem] flex items-center gap-1 text-black-50">
                <i className="fi fi-rr-bell text-[1rem] text-black-50 leading-none my-0"></i>
                <strong>Notifications</strong>
              </div>
              <button
                onClick={markAsRead}
                disabled={notifications.length == 0}
                className="btn btn-link btn-sm link-secondary w-max text-decoration-none"
              >
                <i className="text-sm me-1 bx bxs-check-circle"></i>
                <span className="text-sm">Mark as read</span>
              </button>
            </div>
            <hr className="my-1" />
            <div className="">
              <Nav className="flex-column max-h-[300px] overflow-y-auto custom-scroll">
                {notifications.map((item, index) => (
                  <Link
                    href={route("notifications.open", { id: item.id })}
                    key={item.id}
                    className="group border-b last:border-0 position-relative block py-3 px-3"
                  >
                    <small
                      className={`fw-bolder text-dark flex items-start gap-2`}
                    >
                      {<NotifIcon data={item.data} />}
                      <span className="group-hover:underline">
                        {item.data.title}
                      </span>
                    </small>
                    <div className="w-2 h-2 rounded-circle bg-primary absolute top-5 start-0"></div>
                  </Link>
                ))}
                {notifications.length == 0 && (
                  <NavItem className="text-black-50 my-2">
                    <small>Nothing to show.</small>
                  </NavItem>
                )}
              </Nav>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default NotificationsDropdown;
