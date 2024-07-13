import ModalComponent from "@/Components/ModalComponent";
import dayjs from "dayjs";
import { useState } from "react";
import Flickity from "react-flickity-component";
import "../../../css/flickity.css";

export const ReportImages = ({ entry, tdClass, imgClass }) => {
  const [viewImages, setViewImages] = useState(false);

  return (
    <>
      <ModalComponent
        className={"rounded-0 bg-transparent"}
        show={viewImages}
        handleClose={() => setViewImages((s) => !s)}
        closeButton
        title={"Preview"}
        size="xl"
      >
        <Flickity
          className={"carousel overflow-hidden"} // default ''
          elementType={"div"} // default 'div'
          options={{ initialIndex: 2, prevNextButtons: true, pageDots: true }} // takes flickity options {}
          disableImagesLoaded={false} // default false
          reloadOnUpdate // default false
          static // default false
        >
          {JSON.parse(entry.documentation).map((image, index) => (
            <div className="w-full flex items-center justify-center">
              <img
                key={index}
                src={image}
                alt="sss"
                className="max-h-[50rem] w-auto mx-4 object-cover"
              />
            </div>
          ))}
        </Flickity>
      </ModalComponent>

      <tr
        className={`${
          tdClass ?? "[&>td]:text-sm"
        } border-b [&>td]:border-l [&>td:first-child]:border-0 last:border-0 [&>td]:px-5 [&>td]:py-4`}
      >
        <td>{entry.title}</td>
        <td>{dayjs(entry.date).format("MMM. D, YYYY")}</td>
        <td className="flex flex-wrap gap-2 justify-center">
          {JSON.parse(entry.documentation).map((image, index) => (
            <img
              onClick={() => setViewImages(true)}
              key={index}
              src={image}
              alt="sss"
              className={`${imgClass ?? "w-20 h-20"} rounded-md object-cover`}
            />
          ))}
        </td>
        <td>
          {JSON.parse(entry.participants).map((participant, index) => (
            <div key={index} className="flex items-center gap-1">
              <i className="fi fi-rr-user text-xs"></i>
              <span>{participant.participant}</span>
            </div>
          ))}
        </td>
        <td>{entry.location}</td>
        <td>{entry.conducted_by}</td>
        <td>{entry.budget === 1 ? "Accomplished" : "Not accomplished"}</td>
      </tr>
    </>
  );
};
