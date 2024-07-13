import CardComponent from "@/Components/CardComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react"; // Import useEffect
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";

const EditUnitHead = ({ auth, classifications, unitHead }) => {
  const [classificationIndex, setClassificationIndex] = useState(
    unitHead.designation.classification.id - 1
  );
  const { data, setData, patch, processing, errors } = useForm({
    firstname: unitHead.firstname,
    lastname: unitHead.lastname,
    middlename: unitHead.middlename,
    email: unitHead.email,
    designation_id: unitHead.designation.id,
    password: unitHead.password,
    campus_id: unitHead.campus_id,
  });

  // Use useEffect to set default classificationIndex
  useEffect(() => {
    setClassificationIndex(unitHead.designation.classification.id - 1);
  }, [classifications, unitHead.classification_id]);

  console.log(unitHead);

  const onSubmit = (e) => {
    e.preventDefault();
    patch(route("unit_head.edit", { id: unitHead.id }));
  };

  return (
    <PanelLayout
      headerTitle="Unit Heads"
      defaultActiveLink="unit-heads/records"
    >
      <div className="px-[1.5rem] py-3">
        <CardComponent>
          <Card.Body>
            <p className="fw-bold my-1 text-xl">Update Unit Head Record</p>
            <p className="my-1 text-secondary fw-bold">
              {auth.user.campus?.name} Campus
            </p>
            <hr />
            <Form onSubmit={onSubmit}>
              <Row className="gy-3 mb-4">
                <Col lg>
                  <Form.Label>
                    <span className="text-sm text-danger me-1">*</span>
                    Firstname:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Enter firstname..."
                    value={data.firstname}
                    onChange={(e) => setData("firstname", e.target.value)}
                  />
                </Col>
                <Col lg>
                  <Form.Label>Middlename:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter middlename..."
                    value={data.middlename}
                    onChange={(e) => setData("middlename", e.target.value)}
                  />
                </Col>
                <Col lg>
                  <Form.Label>
                    <span className="text-sm text-danger me-1">*</span>Lastname:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter lastname..."
                    value={data.lastname}
                    onChange={(e) => setData("lastname", e.target.value)}
                  />
                </Col>
              </Row>
              <Row className="gy-3 mb-3">
                <Col lg>
                  <Form.Label>
                    <div className="flex gap-2 items-center">
                      <span className="">Email address</span>
                    </div>
                  </Form.Label>
                  <Form.Control
                    placeholder="Eg. example@gmail.com"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                  />
                  <p className="mb-0 mt-2 text-sm text-danger">
                    {errors?.email}
                  </p>
                </Col>
                <Col lg>
                  <Form.Label>
                    <div className="flex gap-2 items-center">
                      <span className="">Password</span>
                    </div>
                  </Form.Label>
                  <Form.Control
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <p className="mb-0 mt-2 text-sm text-danger">
                    {errors?.password}
                  </p>
                </Col>
                <Col>
                  <Form.Label>Classification:</Form.Label>
                  <Form.Select
                    value={classificationIndex}
                    onChange={(e) => setClassificationIndex(e.target.value)}
                  >
                    {classifications &&
                      classifications.map((c, index) => (
                        <option value={index} key={index}>
                          {c.name}
                        </option>
                      ))}
                  </Form.Select>
                  <p className="mb-0 mt-2 text-sm text-danger">
                    {errors?.campus_id}
                  </p>
                </Col>
                <Col>
                  <Form.Label>
                    <span className="text-sm text-danger me-1">*</span>
                    Designation:
                  </Form.Label>
                  <Form.Select
                    value={data.designation_id}
                    onChange={(e) => setData("designation_id", e.target.value)}
                  >
                    {classifications[classificationIndex].designations.map(
                      (d, index) => (
                        <option key={index} value={d.id}>
                          {d.name}
                        </option>
                      )
                    )}
                  </Form.Select>
                  <p className="mb-0 mt-2 text-sm text-danger">
                    {errors?.campus_id}
                  </p>
                </Col>
              </Row>

              <div className="text-end mt-4">
                <Button
                  as={Link}
                  href={route("admin.unit_heads.records")}
                  variant="light"
                  type="submit"
                  className="me-2 rounded-1"
                >
                  Cancel
                </Button>
                <Button className="rounded-1" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Body>
        </CardComponent>
      </div>
    </PanelLayout>
  );
};

export default EditUnitHead;
