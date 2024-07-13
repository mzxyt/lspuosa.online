import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Image,
  Nav,
  NavDropdown,
  NavItem,
  Navbar,
} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import NavbarHeader from "./NavbarHeader";
import NavLink from "./NavLink";
import ThemeSwitch from "./ThemeSwitch";
import { useThemeState, useUserAuthState } from "@/States/States";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import NotificationsDropdown from "./NotificationsDropdown";
import CalendarDropdown from "./CalendarDropdown";
const NavbarComponent = ({ isActive, setIsActive, headerTitle }) => {
  const { theme, setTheme } = useThemeState();
  const { auth: userAuth } = usePage().props;

  const getUserType = () => {
    let role = userAuth.role;

    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "unit_head":
        return "Unit Head";
      default:
        return "Guest";
    }
  };

  return (
    <>
      <NavbarHeader isActive={isActive} setIsActive={setIsActive} />
      <div className={`${isActive ? "" : "active"} app-header `}>
        <Navbar
          bg={theme === "light" ? "white" : "dark"}
          data-bs-theme={theme}
          className={`border-bottom `}
        >
          <Container fluid>
            <div className="me-auto align-items-center lg:gap-3 md:gap-3 gap-0 position-relative">
              <div className="nav-control ">
                <div
                  onClick={() => setIsActive(!isActive)}
                  className={`hamburger ${isActive ? "" : "is-active"}`}
                >
                  <span className="line"></span>
                  <span className="line"></span>
                  <span className="line"></span>
                </div>
              </div>
            </div>
            <div className="flex h-full items-center justify-center">
              <p className="mt-3">
                {/* date format : January 22, 2024, 9:57 PM */}
                {new Date().toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
            <Nav className="ms-auto align-items-center lg:gap-3 md:gap-3 gap-0">
              {userAuth?.role === "unit_head" && (
                <>
                  <NotificationsDropdown />

                  <CalendarDropdown />
                </>
              )}

              <Dropdown align="end" as={NavItem} className="">
                <DropdownToggle
                  bsPrefix="nav-profile-toggler"
                  data-bs-theme={theme}
                  className="cursor-pointer btn btn-link nav-link bg-transparent text-decoration-none"
                >
                  <div className=" flex gap-x-2 justify-center text-center items-center">
                    <Image
                      className="rounded-circle lg:w-[45px] aspect-square object-cover w-[35px]"
                      src={userAuth?.user?.image}
                      alt="User Photo"
                    />
                    <div className="text-start lg:block sm:hidden md:block hidden">
                      {userAuth?.user ? (
                        <>
                          <p className="my-0 text-dark">
                            <strong>
                              {userAuth.user.firstname} {userAuth.user.lastname}{" "}
                            </strong>
                            <br />
                            <small className="my-0">{getUserType()}</small>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="my-0">
                            <strong>Guest</strong>
                            <br />
                            <small className="my-0">Guest</small>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownToggle>
                <Dropdown.Menu className="shadow-md shadow-black/[0.05]">
                  <div className="text-center w-[13rem] pt-2">
                    <Image
                      src={userAuth?.user?.image}
                      className="aspect-square object-cover mx-auto rounded-circle"
                      width={70}
                      height={70}
                    />
                    <p className="mt-2 mb-1 text-sm fw-bold">
                      {userAuth?.user?.firstname} {userAuth?.user?.lastname}
                    </p>
                  </div>
                  <div className="px-2">
                    <hr className="bg-light text-black-50 mb-1" />
                  </div>
                  <Nav className="flex-column px-2 mt-2">
                    <Nav.Item>
                      <Link
                        preserveScroll={false}
                        href={route("profile.edit")}
                        className="block py-1.5 text-slate-800 hover:bg-slate-100 rounded px-3"
                      >
                        Profile
                      </Link>
                    </Nav.Item>
                    {/* check user is he/she is unit_head */}
                    {userAuth?.role === "unit_head" && (
                      <Nav.Item>
                        <Link
                          onClick={() => {
                            axios
                              .patch(
                                route("users.deactivate", userAuth.user.id)
                              )
                              .then(() => {
                                // signout
                                window.location.href = route("admin.signout");
                              });
                          }}
                          className="block py-1.5 text-slate-800 hover:bg-slate-100 rounded px-3"
                        >
                          Deactivate Account
                        </Link>
                      </Nav.Item>
                    )}
                    <Nav.Item>
                      <Link
                        href={route("admin.signout")}
                        className="block py-1.5 text-rose-600 hover:bg-rose-100 rounded px-3"
                      >
                        Log Out
                      </Link>
                    </Nav.Item>
                  </Nav>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>
        <div
          className={`${
            theme === "light" ? "bg-white" : "bg-dark"
          } sub-header w-full px-3 border-bottom shadow-sm`}
        >
          <div className="container-fluid fs-6 text-capitalize">
            {headerTitle} {/* time and date */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarComponent;
