import React from "react";
import { Col, Container, Form, Image, Row } from "react-bootstrap";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="bg-[#F3F4F6]">
      <Container>
        <Row className="justify-content-center min-h-screen md:items-center">
          <Col lg={5} md={8}>
            <div className="card mb-5 border-0 shadow-md md:min-h-max min-h-full rounded-3">
              <div className="card-body md:p-20 p-4">
                <div className="text-center mb-[20px]">
                  <Image
                    src="/images/logo.png"
                    alt="OSA Logo"
                    className="img-fluid w-[90px] h-[90px] mx-auto mb-3"
                  />
                  <h5 className="text-uppercase fw-bolder">
                    <span className=" text-primary">{title}</span>
                  </h5>
                  <h6 className="text-uppercase fw-bold">
                    <span className=" text-secondary">Sign In</span>
                  </h6>
                </div>
                {children}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;
