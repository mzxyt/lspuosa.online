import PanelLayout from "@/Layouts/PanelLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import ModalComponent from "@/Components/ModalComponent";
import { TextButton } from "@/Components/CustomBtn";
import { useRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import ConfirmModal from "@/Components/ConfirmModal";

const Calendar = ({ auth, events: allEvents }) => {
  const [deleteAllEventsModal, setDeleteAllEventsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [events, setEvents] = useState([...allEvents]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const onSelectDate = (d) => {
    // check if the date is in the past
    const today = new Date();
    if (d.start < today) {
      toast.error("You can't add an event in the past");
      return;
    }
    setStartDate(d.startStr);
    setEndDate(d.endStr);
    setShowAddModal(true);
  };
  const onNewEventAdded = (newEvent) => {
    setEvents((e) => [...e, newEvent]);
    toast.success("Successfully added!");
  };

  const onEventSelect = (e) => {
    console.log(e);
    setEventId(e.event.id);
    setShowConfirmModal(true);
  };

  const deleteEvent = () => {
    axios.delete(route("calendar.destroy", eventId)).then((res) => {
      setShowConfirmModal(false);
      let eventList = events.filter((e, i) => e.id != eventId);
      setEvents(eventList);
      toast.success("Successfully deleted");
    });
  };

  const deleteAllEvents = () => {
    axios.delete(route("calendar.destroy.all", auth.user.id)).then((res) => {
      setDeleteAllEventsModal(false);
      setEvents([]);
      toast.success("Successfully deleted");
    });
  };

  return (
    <PanelLayout headerTitle={"Calendar"} defaultActiveLink={"calendar"}>
      <ConfirmModal
        title="Delete this event?"
        processing={processing}
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        onConfirm={deleteEvent}
        onCancel={() => setShowConfirmModal(false)}
      />
      <AddEventModal
        startDate={startDate}
        endDate={endDate}
        onSuccess={onNewEventAdded}
        userId={auth.user?.id}
        show={showAddModal}
        handleClose={() => setShowAddModal((s) => !s)}
      />
      <div className="py-3 px-[1.5rem]">
        <Alert variant="info">
          <i className="bx bx-info-circle me-2"></i>
          <span>Select a date to add an event</span>
        </Alert>
        <Row className="gx-2 gy-2">
          <Col lg={2}>
            <ConfirmModal
              title="Delete all events?"
              show={deleteAllEventsModal}
              handleClose={() => setDeleteAllEventsModal(false)}
              onConfirm={deleteAllEvents}
              onCancel={() => setDeleteAllEventsModal(false)}
            />
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <p className="text-black-50">All Events</p>
                <button
                  onClick={() => setDeleteAllEventsModal(true)}
                  className="hover:bg-rose-700 hover:text-white hover:border-transparent transition text-sm py-1.5 rounded-md w-full border-[1px] border-rose-300 text-rose-700 font-medium"
                >
                  Delete all
                </button>
                <div className="mt-3">
                  {events.map((event, index) => (
                    <div className="mb-3">
                      <p className="my-0 font-medium">{event.title}</p>
                      <p className="my-0 text-sm text-black-50">
                        <small>{event.start}</small>
                      </p>
                    </div>
                  ))}
                </div>
                {events.length == 0 && (
                  <p className="my-1 text-sm">No events to show.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 text-sm">
                <FullCalendar
                  handleWindowResize
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  weekends:false
                  events={events}
                  themeSystem="Sandstone"
                  editable
                  dayMaxEventRows={3}
                  eventDrop={(e) => console.log(e)}
                  headerToolbar={{
                    left: "title",
                    center: "",
                    right: "prev,next",
                  }}
                  titleFormat={{
                    year: "numeric",
                    month: "short",
                  }}
                  eventClick={onEventSelect}
                  selectable
                  select={onSelectDate}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PanelLayout>
  );
};

const AddEventModal = ({
  onSuccess,
  handleClose,
  show,
  startDate,
  endDate,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [processing, setProcessing] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  const onSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("start", startDate);
    formData.append("end", endDate);
    formData.append("user_id", userId);

    axios
      .post(route("calendar.store"), formData)
      .then((res) => {
        console.log(res);
        onSuccess(res.data.event);
        setProcessing(false);
        handleClose();
        setTitle("");
      })
      .catch((err) => {
        console.log("error: ", err);
        setProcessing(false);
        toast.error(err.message);
        handleClose();
        setTitle("");
      });
  };

  return (
    <ModalComponent
      backdrop={processing ? "static" : true}
      centered
      show={show}
      handleClose={handleClose}
    >
      <Form onSubmit={onSubmit}>
        <div className="p-3">
          <p className="fs-5 fw-bold">New Event</p>
          <Form.Label className="text-secondary">
            Enter a title for your event
          </Form.Label>
          <Form.Control
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            ref={inputRef}
          />
        </div>
        <div className="text-end">
          <TextButton
            type="button"
            disabled={processing}
            onClick={handleClose}
            text="Cancel"
          />
          <TextButton
            disabled={processing || title.length == 0}
            type="submit"
            text="Submit"
          />
        </div>
      </Form>
    </ModalComponent>
  );
};

export default Calendar;
