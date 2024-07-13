import ConfirmModal from "@/Components/ConfirmModal";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { toast } from "sonner";

const Reminders = ({ auth, reminders }) => {
  const [reminderList, setReminderList] = useState([...reminders]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reminderId, setReminderId] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const confirmAction = (id) => {
    setReminderId(id);
    setShowConfirmModal(true);
  };

  const viewAnnouncement = (a) => {
    setReminder(a);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setTimeout(() => setReminder(null), 500);
  };

  const deleteReminder = () => {
    setProcessing(true);
    axios.delete(route("reminder.delete", reminderId)).then((res) => {
      console.log(res);
      removeFromList(reminderId);
    });
  };

  const removeFromList = (id) => {
    let newList = reminderList.filter((item, index) => item.id !== id);
    setReminderList(newList);
    setShowConfirmModal(false);
    setProcessing(false);
    toast.success("Successfully deleted!");
  };

  return (
    <PanelLayout
      userAuth={auth}
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="reminders"
    >
      <ModalComponent
        centered
        size="lg"
        show={showViewModal}
        handleClose={closeViewModal}
      >
        {reminder && (
          <div className="my-3">
            <p className="fs-4 mb-0 fw-bold">{reminder.title}</p>
            <p className="mt-0 mb-2 text-sm text-secondary">
              <small>
                {format(new Date(reminder.created_at), "MMM dd, yyy / hh:mm a")}
              </small>
            </p>
            <p className="fs-6 mt-3 whitespace-pre-wrap">{reminder.content}</p>
          </div>
        )}
      </ModalComponent>
      <ConfirmModal
        title="Are you sure to delete this reminder?"
        message="This action cannot be undone."
        processing={processing}
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        onConfirm={deleteReminder}
        onCancel={() => setShowConfirmModal(false)}
      />
      <div className="py-3">
        <div className="px-[1.5rem]">
          {/* <div className="text-end mb-2">
                    </div> */}
          <Card className="border-0 shadow-sm mt-3 p-4">
            <Card.Header className="p-0 border-0 bg-white bg-opacity-80">
              <div className="lg:flex justify-content-between items-start">
                <div className="my-1">
                  <h1 className="text-xl font-bold mb-2 leading-none">
                    Posted reminders
                  </h1>
                  <p className="leading-none mb-4 text-slate-500">
                    {auth.role == "unit_head"
                      ? "Check details about the reminders that admins have posted."
                      : "Create, remove, edit, and check details about the reminders you posted."}
                  </p>
                </div>
                {auth.role === "unit_head" ? null : (
                  <Link
                    href={route("admin.create_reminder")}
                    className="bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                  >
                    <i className="bx bx-plus"></i>{" "}
                    <span className="tracking-wide">Create new</span>
                  </Link>
                )}
              </div>
            </Card.Header>
            <Card.Body className="position-relative p-0">
              <ListGroup variant="flushed" className=" list-group-flush">
                {reminderList && reminderList.length > 0 ? (
                  reminderList.map((item, index) => (
                    <ListGroupItem key={index}>
                      <Row
                        key={index}
                        className="flex mt-1 align-items-center gy-3"
                      >
                        <Col className="p-0">
                          <p className=" fw-bold fs-5 mb-0">{item.title}</p>
                          <p className="mt-0 mb-2 text-sm text-secondary">
                            <small>
                              {format(
                                new Date(item.created_at),
                                "MMM dd, yyy / hh:mm a"
                              )}
                            </small>
                          </p>
                          <p className="whitespace-pre-wrap line-clamp-3">
                            {item.content}
                          </p>
                        </Col>
                        <Col lg={1}>
                          <div className="flex justify-end">
                            <button
                              className="btn btn-link fs-6 hover:bg-gray-200 text-decoration-none"
                              type="button"
                              onClick={() => viewAnnouncement(item)}
                            >
                              <i className="fi fi-br-expand"></i>
                            </button>
                            {auth.role !== "unit_head" && (
                              <Dropdown>
                                <Dropdown.Toggle
                                  bsPrefix="toggler"
                                  className=" btn-link bg-transparent text-decoration-none"
                                >
                                  <i className=" fi fi-br-menu-dots-vertical"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                  <Dropdown.Item
                                    href={route("admin.edit_reminder", {
                                      id: item.id,
                                    })}
                                  >
                                    Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => confirmAction(item.id)}
                                  >
                                    Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))
                ) : (
                  <div className="text">
                    <p className="mb-0 text-secondary text-sm">
                      No reminders to show.
                    </p>
                  </div>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
};

export default Reminders;
