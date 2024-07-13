import ConfirmModal from "@/Components/ConfirmModal";
import { TextButton } from "@/Components/CustomBtn";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
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

const Announcements = ({ auth, announcements: announcementList }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [announcements, setAnnouncements] = useState([...announcementList]);
  const [reOrdered, setReOrdered] = useState([...announcementList]);
  const [announcement, setAnnouncement] = useState(null);
  const [announcementId, setAnnouncementId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggingEnable, setDraggingEnable] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const deleteRow = (id) => {
    setAnnouncementId(id);
    setShowConfirmModal(true);
  };

  const onConfirm = () => {
    setProcessing(true);
    axios.delete(route("announcements.delete", announcementId)).then((res) => {
      console.log(res);
      removeFromList(announcementId);
    });
  };

  const removeFromList = (id) => {
    let newList = announcements.filter((item, index) => item.id !== id);
    setAnnouncements(newList);

    let newReorderedList = reOrdered.filter((item, index) => item.id !== id);
    setReOrdered(newReorderedList);

    setShowConfirmModal(false);
    setProcessing(false);

    toast.success("Successfully deleted!");
  };

  const viewAnnouncement = (a) => {
    setAnnouncement(a);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setTimeout(() => setAnnouncement(null), 500);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    let items = [...reOrdered];

    const orderedItems = Array.from(reOrdered);

    const [reorderedItem] = orderedItems.splice(result.source.index, 1);
    orderedItems.splice(result.destination.index, 0, reorderedItem);

    setReOrdered(orderedItems);

    // let srcOrder = items[result.source.index].order;
    // items[result.source.index].order = items[result.destination.index].order;
    // items[result.destination.index].order = srcOrder;
    saveOrder(
      orderedItems[result.source.index].id,
      orderedItems[result.destination.index].id
    );
  };

  const saveOrder = (item1, item2) => {
    setSaving(true);
    axios
      .patch("/announcements/order", { item_1: item1, item_2: item2 })
      .then((res) => {
        console.log(res);
        setSaving(false);
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  return (
    <PanelLayout
      userAuth={auth}
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="announcements"
    >
      <ModalComponent
        centered
        size="lg"
        show={showViewModal}
        handleClose={closeViewModal}
      >
        {announcement && (
          <div className="my-2 container">
            <p className="fs-4 mb-0 fw-bold">{announcement.title}</p>
            <p className="mt-0 mb-2 text-sm text-secondary">
              <small>
                {format(
                  new Date(announcement.created_at),
                  "MMM dd, yyy / hh:mm a"
                )}
              </small>
            </p>
            <p className="fs-6 mt-3 whitespace-pre-wrap">
              {announcement.content}
            </p>

            {announcement.images &&
              Object.keys(announcement.images).length > 0 && (
                <div className="d-flex flex-wrap">
                  {Object.values(JSON.parse(announcement.images)).map(
                    (image, index) => (
                      <div key={index} className="m-2">
                        <Image
                          fluid
                          thumbnail
                          draggable={false}
                          className="rounded-0 shadow-sm max-h-[40rem]"
                          src={image}
                        />
                      </div>
                    )
                  )}
                </div>
              )}

            <hr />
            <div className="text-end">
              <TextButton text="Close" onClick={closeViewModal} />
            </div>
          </div>
        )}
      </ModalComponent>
      <ConfirmModal
        processing={processing}
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        onConfirm={onConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
      <div className="">
        <div className="content-wrapper">
          <Card className="border-0 shadow-sm mt-3 p-4">
            <Card.Header className="p-0 border-0 bg-white bg-opacity-80">
              <div className="lg:flex justify-content-between items-start">
                <div className="my-1">
                  <h1 className="text-xl font-bold mb-2 leading-none">
                    Posted announcements
                  </h1>
                  <p className="leading-none mb-4 text-slate-500 text-sm">
                    Create, remove, edit, and check details about the
                    announcements you posted.
                  </p>
                </div>
                <Link
                  href={route("admin.create_announcement")}
                  className="bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                >
                  <i className="bx bx-plus"></i>{" "}
                  <span className="tracking-wide">Create new</span>
                </Link>
              </div>
            </Card.Header>
            <Card.Body className="p-0 position-relative ">
              {saving && (
                <p className={`text-center text-sm text-slate-500 mt-0 mb-2`}>
                  Saving changes...
                </p>
              )}
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="announcements">
                  {(provided) => (
                    <ListGroup
                      variant="flushed"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {reOrdered && reOrdered.length > 0 ? (
                        reOrdered &&
                        reOrdered.map((item, index) => (
                          <Draggable
                            isDragDisabled={saving}
                            key={item.id}
                            draggableId={`announcement-${item.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <ListGroupItem
                                className={`mb-2 hover:bg-slate-100 rounded-md p-4 border border-slate-200 ${
                                  snapshot.isDragging ? "dragging" : ""
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Row key={index} className="items-start">
                                  <Col lg={6} md={6}>
                                    <p className=" fw-bold fs-5 mb-0">
                                      {item.title}
                                    </p>
                                    <p className="mt-0 mb-2 text-sm text-secondary">
                                      <small>
                                        {format(
                                          new Date(item.created_at),
                                          "MMM dd, yyy / hh:mm a"
                                        )}
                                      </small>
                                    </p>
                                    <p className="whitespace-pre-wrap line-clamp-3 mb-0 text-secondary">
                                      {item.content}
                                      ...
                                    </p>
                                  </Col>
                                  <Col lg={5}>
                                    {item.images &&
                                      Object.keys(item.images).length > 0 && (
                                        <div className="d-flex flex-row flex-wrap">
                                          {console.log(JSON.parse(item.images))}
                                          {Object.values(
                                            JSON.parse(item.images)
                                          ).map((image, index) => (
                                            <div key={index} className="m-2">
                                              <Image
                                                fluid
                                                thumbnail
                                                draggable={false}
                                                className="rounded-0 shadow-sm max-h-[20rem]"
                                                src={image}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                  </Col>
                                  <Col lg={1}>
                                    <div className="flex ">
                                      <button
                                        className="btn btn-link hover:bg-gray-200 text-decoration-none"
                                        type="button"
                                        onClick={() => viewAnnouncement(item)}
                                      >
                                        <i className="fi fi-br-expand "></i>
                                      </button>

                                      <Dropdown>
                                        <Dropdown.Toggle
                                          bsPrefix="toggler"
                                          className=" btn-link bg-transparent text-decoration-none"
                                        >
                                          <i className=" fi fi-br-menu-dots-vertical"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                          <Dropdown.Item
                                            href={route(
                                              "admin.edit_announcement",
                                              {
                                                id: item.id,
                                              }
                                            )}
                                          >
                                            Edit
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            onClick={() => deleteRow(item.id)}
                                          >
                                            Delete
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </Col>
                                </Row>
                              </ListGroupItem>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="text">
                          <p className="mb-0 text-secondary text-sm">
                            No reminders to show.
                          </p>
                        </div>
                      )}
                      {provided.placeholder}
                    </ListGroup>
                  )}
                </Droppable>
              </DragDropContext>
            </Card.Body>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
};

export default Announcements;
