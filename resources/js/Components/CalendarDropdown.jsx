import { usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Dropdown, Nav, NavItem } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { formatDate } from "./Helper";
import { toast } from "sonner";

const CalendarDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const { auth } = usePage().props;

  const getNotifications = () => {
    axios.get(route("notifications.calendar", auth.user.id)).then((res) => {
      console.log("calendar notifs: ", res);
      setNotifications(res.data.notifications);
    });
  };

  useEffect(() => {
    getNotifications();
    Echo.private("users." + auth.user.id).notification((notification) => {
      console.log("notiifcation recieved: ", notification);
      if (
        notification.type == "App\\Notifications\\CalendarEventNotification"
      ) {
        getNotifications();
      }
    });
  }, []);

  const markAsRead = () => {
    axios
      .patch(route("notifications.read.calendar", auth.user.id))
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
      <Dropdown align="end" as={NavItem} className="dropdown-expand">
        <DropdownToggle
          bsPrefix="nav-profile-toggler"
          className="cursor-pointer btn btn-link nav-link bg-transparent text-decoration-none"
        >
          <div className="c-icon my-0 position-relative">
            <i className="fi fi-rr-calendar-day text-[1.1rem] text-dark leading-none my-0"></i>
            {notifications.length > 0 && (
              <div className="blob bg-primary absolute top-[-3px] end-0"></div>
            )}
          </div>
        </DropdownToggle>
        <Dropdown.Menu className="shadow-sm">
          <div className="px-3">
            <div className="flex items-center">
              <div className="text-center text-sm w-[10rem] flex items-center gap-1 text-black-50">
                <i className="fi fi-rr-calendar text-[1rem] text-black-50 leading-none my-0"></i>
                <strong>Events</strong>
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
              <Nav className="flex-column">
                {notifications.map((item, index) => (
                  <Nav.Link
                    href={route("notifications.open", {
                      id: item.id,
                    })}
                    key={item.id}
                    className=" position-relative ps-3"
                  >
                    <div>
                      <small className={`fw-bolder text-dark`}>
                        {item.data.title}
                      </small>
                      <br />
                      <small className=" text-black-50">
                        {formatDate(
                          new Date(item.data.start ?? item.created_at)
                        )}
                      </small>
                    </div>
                    <div className="w-2 h-2 rounded-circle bg-primary absolute top-[15px] start-0"></div>
                  </Nav.Link>
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

export default CalendarDropdown;
