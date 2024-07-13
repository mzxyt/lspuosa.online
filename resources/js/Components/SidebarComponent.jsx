import { useNavMenuState } from "@/States/States";
import { Link } from "@inertiajs/react";
import React, { useState } from "react";

export const NavType = {
  LINK: 0,
  DROPDOWN: 1,
  BUTTON: 2,
  DOWNLOADABLE: 3,
};

const NavLink = ({ item, activeLink }) => {
  const currentUrl = window.location;
  return (
    <li>
      <Link
        className={
          currentUrl.href === item.href
            ? "active"
            : activeLink == item.urlPath
            ? "active"
            : ""
        }
        href={item.href}
      >
        {item.icon}
        <span>{item.text}</span>
      </Link>
    </li>
  );
};
const NavDownloadable = ({ item }) => {
  return (
    <li>
      <a target="_blank" download={true} href={item.downloadable}>
        {item.icon}
        <span>{item.text}</span>
      </a>
    </li>
  );
};

const NavButton = ({ item }) => {
  return (
    <li>
      <Link
        onClick={(e) => {
          e.preventDefault();
          item.onClick();
        }}
      >
        {item.icon}
        <span>{item.text}</span>
      </Link>
    </li>
  );
};

const isActive = (item, activeLink) => {
  var links = findLinks(item);

  // console.log('activeLink ', activeLink)
  for (let link of links) {
    if (link.urlPath == activeLink) {
      return true;
    }
  }
  return false;
};
const getNavLink = (item) => {
  for (let navLink of item.navList) {
    if (navLink.type == NavType.DROPDOWN) {
      return getNavLink(navLink);
    } else if (navLink.type == NavType.LINK) {
      return navLink;
    }
  }

  return null;
};
const getNavLinks = (item) => {
  var navLinks = [];
  for (let navItem of item.navList) {
    if (navItem.type == NavType.DROPDOWN) {
      let navLink = getNavLink(navItem);
      if (navLink != null) {
        navLinks.push(navLink);
      }
    }
  }
  return navLinks;
};

const findLinks = (dropdown) => {
  let links = [];
  for (let item of dropdown.navList) {
    if (item.type == NavType.DROPDOWN) {
      // let index = 0;
      links.push(...findLinks(item));
    } else if (item.type == NavType.LINK) {
      links.push(item);
    }
  }
  return links;
};

const NavDropdown = ({ item, activeLink }) => {
  const currentUrl = window.location;
  const matched = 0;

  const matchesKey = currentUrl.pathname.split("/")[2] === item.key;
  const active = isActive(item, activeLink) || matchesKey;

  // console.log('dropdownItemData: ', { item, active })

  const [expanded, setExpanded] = useState(active);

  return (
    <li className={`${active ? "active" : ""}`}>
      <a
        onClick={() => setExpanded((s) => !s)}
        aria-expanded={expanded}
        className="has-arrow bx cursor-pointer"
      >
        {item.icon}
        <span className="font-sans">{item.text}</span>
      </a>
      <ul as="ul" className="nested" aria-expanded={expanded}>
        {item.navList &&
          item.navList.map((i, index) =>
            i.type === NavType.LINK ? (
              /* for links */
              <NavLink key={index} activeLink={activeLink} item={i} />
            ) : /* for dropdown */
            i.type === NavType.BUTTON ? (
              <NavButton key={index} item={i} />
            ) : i.type === NavType.DOWNLOADABLE ? (
              <NavDownloadable activeLink={activeLink} key={index} item={i} />
            ) : (
              <NavDropdown activeLink={activeLink} key={index} item={i} />
            )
          )}
      </ul>
    </li>
  );
};

const SidebarComponent = ({ isActive: activeNav, activeLink }) => {
  const { navList, setNavList } = useNavMenuState();

  console.log("navList: ", navList);
  return (
    <div
      className={`app-sidebar shadow-sm bg-white ${activeNav ? "active" : ""}`}
    >
      <div className="sidebar-menu">
        <ul className="main">
          {navList &&
            navList.map((item, index) =>
              item.type === NavType.LINK ? (
                /* for links */
                <NavLink activeLink={activeLink} key={index} item={item} />
              ) : /* for dropdown */
              item.type === NavType.BUTTON ? (
                <NavButton key={index} item={item} />
              ) : item.type === NavType.DOWNLOADABLE ? (
                <NavDownloadable
                  activeLink={activeLink}
                  key={index}
                  item={item}
                />
              ) : (
                <NavDropdown activeLink={activeLink} key={index} item={item} />
              )
            )}
        </ul>
      </div>
    </div>
  );
};

export default SidebarComponent;
