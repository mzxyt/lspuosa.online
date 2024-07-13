import CardComponent from "@/Components/CardComponent";
import ElegantNav from "@/Components/ElegantNav";
import HorizontalScrollingList from "@/Components/HorizontalScrollingList";
import ModalComponent from "@/Components/ModalComponent";
import TextProfilePic from "@/Components/TextProfilePic";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Nav,
  Row,
} from "react-bootstrap";

const UnitHeads = ({ campuses, classifications }) => {
  const { auth } = usePage().props;
  const [tab, setTab] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [unitHead, setUnitHead] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedCampusIndex, setSelectedCampusIndex] = useState(0);
  const [selectedCampus, setSelectedCampus] = useState(
    auth.role === "admin" ? auth.user.campus : campuses[0]
  );

  const [selectedClassificationIndex, setSelectedClassificationIndex] =
    useState(0);

  useEffect(() => {
    const fetchUnitHeads = () => {
      axios
        .post(route("unit_heads.designations"), {
          campus_id: selectedCampus.id,
          classification_id: classifications[selectedClassificationIndex].id,
        })
        .then((res) => {
          setFetching(false);
          setDesignations(res.data.designations);
        })
        .catch((err) => console.log(err));
    };
    setFetching(true);
    fetchUnitHeads();
  }, [selectedCampus, selectedClassificationIndex]);

  const handleSelect = (item) => {
    setUnitHead(item);
    setShowViewModal(true);
  };

  return (
    <PanelLayout
      headerTitle="Unit Heads"
      defaultActiveLink="unit_heads_profiles"
    >
      <ModalComponent
        title={<span className="text-success">Unit Head Profile</span>}
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        closeButton
        size="md"
      >
        {unitHead && (
          <div className="px-3">
            <div className="flex items-end gap-3">
              <div>
                {unitHead.image ? (
                  <Image src={unitHead.image} fluid roundedCircle thumbnail />
                ) : (
                  <TextProfilePic text={unitHead.firstname[0]} size="lg" />
                )}
              </div>
              <div>
                <p className="text-dark">
                  {unitHead.firstname} {unitHead.lastname}
                </p>
              </div>
            </div>
            <p className="flex gap-2 mt-3 mb-0 text-sm ">
              <span className=" fw-bold">
                <i className="fi fi-rr-school me-1"></i> Campus:
              </span>
              <span className=" "> {unitHead.campus.name}</span>
            </p>
            <hr className="my-3" />
            <p className="flex gap-2 mb-0 text-sm ">
              <span className="text-secondar fw-bold">
                <i className="fi fi-rr-user me-1"></i> Designation:
              </span>
              <span className=" ">{unitHead.designation.name}</span>
            </p>
            <hr className="my-3" />
          </div>
        )}
      </ModalComponent>
      <div className="py-3 px-3">
        <Row className="gy-3">
          <Col xl={2} lg={3} md={3}>
            {auth.role === "super_admin" && (
              <ListGroup variant="flush" className=" shadow-sm rounded-0 mb-3">
                <ListGroup.Item className="bg-white">
                  <p className="my-1 text-uppercase fw-bold text-sm">
                    Campuses
                  </p>
                </ListGroup.Item>
                {campuses &&
                  campuses.map((campus, index) => (
                    <ListGroup.Item
                      onClick={() => setSelectedCampus(campus)}
                      key={index}
                      className={`cursor-pointer ${
                        campus === selectedCampus
                          ? " text-primary fw-bold"
                          : "hover:bg-gray-50 text-secondary"
                      }`}
                    >
                      <p className="my-1 flex justify-between items-center">
                        <span>{campus.name}</span>
                        <i className="bx bx-chevron-right"></i>
                      </p>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            )}
            <ListGroup variant="flush" className=" shadow-sm rounded-0">
              <ListGroupItem className="bg-white">
                <p className="my-1 text-uppercase fw-bold text-sm">
                  Classification
                </p>
              </ListGroupItem>
              {classifications &&
                classifications.map((item, index) => (
                  <ListGroupItem
                    onClick={() => setSelectedClassificationIndex(index)}
                    key={index}
                    className={`cursor-pointer ${
                      index === selectedClassificationIndex
                        ? "text-primary fw-bold"
                        : "hover:bg-gray-50 text-secondary"
                    }`}
                  >
                    <p className="my-1 flex justify-between items-center">
                      <span>{item.name}</span>
                      <i className="bx bx-chevron-right"></i>
                    </p>
                  </ListGroupItem>
                ))}
            </ListGroup>
          </Col>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="px-4 py-3 bg-white">
                <div className="flex gap-y-3 items-center flex-wrap">
                  <div className="flex gap-2 fs-6 fw-bold text-dark me-auto">
                    <span>{selectedCampus.name}</span>
                    <span>/</span>
                    <span>
                      {classifications[selectedClassificationIndex].name}
                    </span>
                  </div>
                  {/* <Button variant='light-secondary' size='sm' className='d-flex justify-content-center align-items-center gx-3'>
                                        <i className='fi fi-rr-search me-2'></i>
                                        <span>Search for a unit head</span>
                                    </Button> */}
                </div>
              </Card.Header>
              <Card.Body className="px-4 py-3">
                <div className="">
                  {designations &&
                    designations.map((designation, index) => (
                      <>
                        <div className="flex items-center gap-2 bg-light px-3 mb-3">
                          <p className="my-1 fs-6 flex items-center gap-3 text-secondary fw-bold">
                            <span>{designation.name}</span>
                          </p>
                        </div>
                        <HorizontalScrollingList
                          loading={fetching}
                          list={designation.unit_heads}
                          selector={(item, index) => (
                            <button
                              onClick={() => handleSelect(item)}
                              className=" btn btn-link justify-content-center text-center"
                            >
                              <div>
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    width={40}
                                    roundedCircle
                                    className="border border-white border-2 shadow-sm mx-auto"
                                  />
                                ) : (
                                  <TextProfilePic
                                    size="sm"
                                    text={item.firstname[0]}
                                  />
                                )}
                              </div>
                              <p className="my-0 text-sm fw-bold">
                                {item.firstname} {item.lastname}
                              </p>
                            </button>
                          )}
                        />
                      </>
                    ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PanelLayout>
  );
};

export default UnitHeads;
