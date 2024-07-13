import React from "react";
import Downloadables from "@/constants/downloadables.json";
import { NavType } from "./SidebarComponent";
import FileIcon from "./FileIcon";

const NavDownloadable = () => {
  const downloadableNav = [];

  const folders = Object.keys(Downloadables);

  for (let folder of folders) {
    var navLinks = [];
    for (let downloadable of Downloadables[folder]) {
      if (typeof downloadable == "string") {
        let navLink = {
          type: NavType.DOWNLOADABLE,
          text: <small>{downloadable}</small>,
          icon: (
            <FileIcon
              size="xs"
              file={{
                name: `${downloadable}`,
                uri: `/downloadables/${folder.toUpperCase()}/${downloadable}`,
              }}
            />
          ),
          downloadable: `/downloadables/${folder.toUpperCase()}/${downloadable}`,
        };
        navLinks.push(navLink);
      } else {
        // if object
        let subFolders = Object.keys(downloadable);
        var subNavLinks = [];
        for (let subFolder of subFolders) {
          for (let subDownloadable of downloadable[subFolder]) {
            let subNavLink = {
              type: NavType.DOWNLOADABLE,
              text: <small>{subDownloadable}</small>,
              icon: (
                <FileIcon
                  size="xs"
                  file={{
                    name: `${subDownloadable}`,
                    uri: `/downloadables/${folder.toUpperCase()}/${subFolder}/${subDownloadable}`,
                  }}
                />
              ),
              downloadable: `/downloadables/${folder.toUpperCase()}/${subFolder}/${subDownloadable}`,
            };
            subNavLinks.push(subNavLink);
          }
          let navLink = {
            type: NavType.DROPDOWN,
            text: <small>{subFolder}</small>,
            icon: <i className="fi fi-rr-folder"></i>,
            navList: subNavLinks,
            key: "downloadable",
          };
          navLinks.push(navLink);
        }
      }
    }
    let navDropdown = {
      type: NavType.DROPDOWN,
      text: folder,
      icon: <i className="fi fi-rr-folder"></i>,
      opened: false,
      navList: navLinks,
      key: "downloadable",
    };
    downloadableNav.push(navDropdown);
  }

  return downloadableNav;
};

export default NavDownloadable;
