import Viewables from "@/constants/viewables.json";
import { NavType } from "./SidebarComponent";
import FileIcon from "./FileIcon";

const NavViewable = (setShowFileModal, setSelectedFile) => {
  const viewableNav = [];

  const planFolders = Object.keys(Viewables);

  for (let planFolder of planFolders) {
    var navLinks = [];
    for (let downloadable of Viewables[planFolder]) {
      if (typeof downloadable == "string") {
        let uri = `/plans/${planFolder}/${downloadable}`;
        let navLink = {
          type: NavType.BUTTON,
          text: <small>{downloadable}</small>,
          icon: (
            <FileIcon
              size="xs"
              file={{
                name: `${downloadable}`,
                uri,
              }}
            />
          ),
          onClick: () => {
            setShowFileModal(true);
            setSelectedFile({ uri, name: planFolder });
          },
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
                    uri: `/plans/${planFolder.toUpperCase()}/${subFolder}/${subDownloadable}`,
                  }}
                />
              ),
              downloadable: `/plans/${planFolder.toUpperCase()}/${subFolder}/${subDownloadable}`,
            };
            subNavLinks.push(subNavLink);
          }
          let navLink = {
            type: NavType.DROPDOWN,
            text: <small>{subFolder}</small>,
            icon: <i className="fi fi-rr-folder"></i>,
            opened: false,
            navList: subNavLinks,
          };
          navLinks.push(navLink);
        }
      }
    }
    let navDropdown = {
      type: NavType.DROPDOWN,
      text: planFolder,
      icon: <i className="fi fi-rr-folder"></i>,
      opened: false,
      navList: navLinks,
    };
    viewableNav.push(navDropdown);
  }

  return viewableNav;
};

export default NavViewable;
