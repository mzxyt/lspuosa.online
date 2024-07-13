import FullCalendar from "@fullcalendar/react";
import React from "react";
import { Button, Card, Col } from "react-bootstrap";
import dayGridPlugin from "@fullcalendar/daygrid";
import listViewPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import ModalComponent from "./ModalComponent";

const CalendarCard = ({
  viewButton = false,
  className = "",
  expandButton = false,
}) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = () => {
    axios.get(route("calendar.index")).then((res) => {
      setEvents(res.data.events);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <>
      <ModalComponent
        size="fullscreen"
        show={showModal}
        handleClose={() => setShowModal(false)}
        closeButton
        title="Event Calendar"
      >
        <div className="">
          <FullCalendar
            viewClassNames={"custom-scroll"}
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              listViewPlugin,
              timeGridPlugin,
            ]}
            initialView="dayGridMonth"
            weekends:false
            events={events}
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev,next",
            }}
            titleFormat={{ year: "numeric", month: "short" }}
            themeSystem="bootstrap5"
          />
        </div>
      </ModalComponent>
      <Card className={`border-0 shadow-sm ${className}`}>
        <Card.Header className="pb-0 pt-4 border-0 bg-white px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold mb-2 leading-none">
                Event calendar
              </h1>
              <p className="leading-none mb-4 text-slate-500 text-sm">
                Check out the scheduled dates for events.
              </p>
            </div>
            {viewButton && (
              <Link
                href={route("calendar")}
                className="text-sm border-[1px] hover:bg-slate-100 border-slate-200 px-3 py-2 text-indigo-500 font-semibold rounded-md"
              >
                View
              </Link>
            )}
            {expandButton && (
              <button
                className="btn btn-link link-dark text-decoration-none"
                type="button"
                onClick={() => setShowModal(true)}
              >
                <i className="fi fi-rr-expand"></i>
              </button>
            )}
          </div>
        </Card.Header>
        <Card.Body className="pt-0 px-4 text-sm">
          <FullCalendar
            viewClassNames={"custom-scroll"}
            plugins={[
              dayGridPlugin,
              interactionPlugin,
              listViewPlugin,
              timeGridPlugin,
            ]}
            initialView="dayGridMonth"
            weekends:false
            events={events}
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev,next",
            }}
            titleFormat={{ year: "numeric", month: "short" }}
            themeSystem="bootstrap5"
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default CalendarCard;
