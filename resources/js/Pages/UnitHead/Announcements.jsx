import { formatDate } from "@/Components/Helper";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import React from "react";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";

const Announcements = ({ announcements }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  return (
    <PanelLayout headerTitle="Announcements">
      {announcement && (
        <ModalComponent
          title="Announcement"
          closeButton
          show={showViewModal}
          size="lg"
          handleClose={() => {
            setShowViewModal(false);
            // setAnnouncement(null)
          }}
        >
          {/* <p className='fw-bold text-secondary flex justify-between'>
                            <span>Announcement</span>
                            <i className='fi fi-rr-megaphone'></i>
                        </p> */}
          <p
            title={announcement.title}
            className="text-dark mb-1 w-100 fs-6 fw-bold text-truncate col-12"
          >
            {announcement.title}
          </p>
          <p className="my-0 text-sm">
            {formatDate(new Date(announcement.created_at))}
          </p>
          <div className="mt-3">
            <p className="whitespace-pre-wrap">{announcement.content}</p>
            <Col lg={5} md={8} sm={8} xs={12}>
              <div className="flex">
                {announcement.images &&
                  // get all images from JSON
                  JSON.parse(announcement.images).map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      className="mb-2 m-2 w-100 h-auto"
                    />
                  ))}
              </div>
            </Col>
          </div>
        </ModalComponent>
      )}
      <div className="py-3 px-[1.5rem]">
        <Row className="g-3">
          {announcements.length > 0 ? (
            announcements.map((item, index) => (
              <Col key={index} xl={3} md={6} lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4 ">
                    <div className="">
                      <p
                        title={item.title}
                        className=" text-dark fw-bold w-100 fs-6 mt-1 mb-2 text-truncate col-12"
                      >
                        {item.title}
                      </p>
                      <div className="flex justify-between mb-3">
                        <p className="my-0 text-sm">
                          {formatDate(new Date(item.created_at))}
                        </p>
                        <i className="fi fi-rr-megaphone text-black-50"></i>
                      </div>

                      <p
                        className="whitespace-pre-wrap text-dark line-clamp-3 mb-4 col-12 truncate"
                        title={item.content}
                      >
                        {item.content}
                      </p>

                      {/* {item.image && (
                        <div className="w-100 h-[170px] overflow-hidden border shadow-sm">
                          <Image
                            width={150}
                            src={item.image}
                            className="mb-2 w-100 h-auto"
                          />
                        </div>
                      )} */}
                      {/* item.images is JSON */}
                      {item.images && (
                        <div className="w-100 h-[170px] overflow-hidden border shadow-sm">
                          <Image
                            width={150}
                            src={JSON.parse(item.images)[0]}
                            className="mb-2 w-100 h-auto"
                          />
                        </div>
                      )}

                      <hr />
                      <div className="text-end">
                        <button
                          onClick={() => {
                            setAnnouncement(item);
                            setShowViewModal(true);
                          }}
                          type="button"
                          className="d-flex items-center btn btn-link link-primary text-decoration-none ms-auto"
                        >
                          <i className="fi fi-rr-expand fs-5 m-0"></i>
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div>No announcements.</div>
          )}
        </Row>
      </div>
    </PanelLayout>
  );
};

export default Announcements;
