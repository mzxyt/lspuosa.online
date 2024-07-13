import CardComponent from "@/Components/CardComponent";
import ImageUploader from "@/Components/ImageUploader";
import TransparentModal from "@/Components/TransparentModalComponent";
import getCroppedImg from "@/Components/cropImage";
import PanelLayout from "@/Layouts/PanelLayout";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import React from "react";
import { useState, useRef, useCallback } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import Cropper from "react-easy-crop";

const Profile = ({ auth }) => {
  const [showImageUploader, setShowImageUploader] = useState(false);
  const { user, role } = auth;
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const { data, setData, errors, processing, patch, reset } = useForm({
    image: user.image,
    firstname: user.firstname,
    lastname: user.lastname,
    middlename: user.middlename,
    phone: user.phone,
    email: user.email,
  });

  const inputElemRef = useRef();

  const onSelectImage = (e) => {
    var files = e.target.files;
    if (files.length > 0) {
      setSelectedImage(files[0]);
      // setShowCropper(true);
      uploadImage(files[0]);
    }
  };

  const uploadImage = (image) => {
    let formData = new FormData();
    formData.append("image", image);
    setIsUploading(true);
    axios
      .post(route("image.upload"), formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setData("image", res.data.imageUrl);
        setIsUploading(false);
      })
      .catch((err) => {
        console.error("error uploading image: ", err);
        setIsUploading(false);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };

  const onSubmitCrop = useCallback(async () => {
    setShowCropper(false);
    try {
      const croppedImage = await getCroppedImg(
        URL.createObjectURL(selectedImage),
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      // setCroppedImage(croppedImage)
      fetch(croppedImage)
        .then((res) => {
          console.log("fetched: ", res);
          // uploadImage(res)
        })
        .catch((err) => console.log);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  return (
    <PanelLayout headerTitle="Account Profile" defaultActiveLink="profile">
      <input
        type="file"
        accept="image/*"
        ref={inputElemRef}
        onChange={onSelectImage}
        className="d-none"
      />
      <TransparentModal
        show={showCropper}
        handleClose={() => setShowCropper(false)}
      >
        {selectedImage && (
          <>
            <div className="controls">
              <Button
                variant="dark"
                className="control"
                onClick={() => setShowCropper(false)}
              >
                <i className="bx bx-x fs-5"></i>
              </Button>
              <Button
                variant="l-green"
                className="control"
                onClick={onSubmitCrop}
              >
                <i className="bx bx-check fs-5"></i>
              </Button>
            </div>
            <Cropper
              image={URL.createObjectURL(selectedImage)}
              crop={crop}
              zoom={zoom}
              aspect={2 / 2}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </>
        )}
      </TransparentModal>
      <ImageUploader
        show={showImageUploader}
        closeOnComplete
        handleClose={() => setShowImageUploader(false)}
        onCompleted={(img) => setData("image", img)}
      />
      <div className="content-wrapper">
        <CardComponent>
          <Card.Body>
            <Form onSubmit={onSubmit}>
              <Row className="gy-3 align-items-end">
                <Col lg={"auto"}>
                  {data.image ? (
                    <Image
                      src={data.image}
                      fluid
                      thumbnail
                      width={150}
                      height={150}
                      className="m-0 rounded-3"
                    />
                  ) : (
                    <TextProfilePic
                      text={`${unitHead.firstname[0]} ${unitHead.lastname[0]}`}
                      bg="light"
                      className="text-primary fw-bold"
                    />
                  )}
                </Col>
                <Col lg>
                  <p className="mb-0 text-sm text-secondary">
                    Change Photo (2x2 ID Pic):
                  </p>
                  <p className="text-sm mt-1 mb-2 text-rose-500 font-medium">
                    *Limit 2mb and 1024 x 1024 max resolution
                  </p>
                  <button
                    disabled={isUploading}
                    className="btn btn-link text-decoration-none"
                    type="button"
                    onClick={() => setData("image", user.image)}
                  >
                    <small>Reset</small>
                  </button>
                  <Button
                    disabled={isUploading}
                    onClick={() => inputElemRef.current.click()}
                    type="button"
                    variant="light-primary"
                    size="sm"
                  >
                    {isUploading ? "Uploading..." : "Choose photo"}
                  </Button>
                </Col>
              </Row>
              <hr />
              <Row className="gy-3">
                <Col lg={4}>
                  <Form.Label className=" text-sm">Firstname:</Form.Label>
                  <Form.Control
                    type="text"
                    value={data.firstname}
                    onChange={(e) => setData("firstname", e.target.value)}
                    required
                  />
                </Col>
                <Col lg={4}>
                  <Form.Label className=" text-sm">Middlename:</Form.Label>
                  <Form.Control
                    type="text"
                    value={data.middlename}
                    onChange={(e) => setData("middlename", e.target.value)}
                  />
                </Col>
                <Col lg={4}>
                  <Form.Label className=" text-sm">Lastname:</Form.Label>
                  <Form.Control
                    type="text"
                    value={data.lastname}
                    onChange={(e) => setData("lastname", e.target.value)}
                    required
                  />
                </Col>
                <Col lg={4}>
                  <Form.Label className=" text-sm">Phone Number:</Form.Label>
                  <Form.Control
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                  />
                </Col>
                <Col lg={4}>
                  <Form.Label className=" text-sm">Email Address:</Form.Label>
                  {auth.role === "super_admin" ? (
                    <Form.Control
                      type="text"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      value={auth.user.email}
                      readOnly
                      disabled
                    />
                  )}
                </Col>
              </Row>
              {role === "unit_head" && (
                <Row className="mt-1 gy-3">
                  <Col lg={4}>
                    <Form.Label className="text-secondary text-sm">
                      Campus:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={auth.user.campus.name}
                      readOnly
                      disabled
                    />
                  </Col>
                  <Col lg={4}>
                    <Form.Label className="text-secondary text-sm">
                      Classification:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={auth.user.designation.classification.name}
                      readOnly
                      disabled
                    />
                  </Col>
                  <Col lg={4}>
                    <Form.Label className="text-secondary text-sm">
                      Designation:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={auth.user.designation.name}
                      readOnly
                      disabled
                    />
                  </Col>
                </Row>
              )}
              <div className="flex items-center justify-end gap-2 mb-3 mt-5">
                <Button onClick={reset} variant="secondary">
                  <small>
                    <i className="bx bx-reset-alt"></i>Reset
                  </small>
                </Button>
                <Button
                  disabled={processing || isUploading}
                  variant="primary"
                  className=""
                  type="submit"
                >
                  <small>Save Changes</small>
                </Button>
              </div>
            </Form>
          </Card.Body>
        </CardComponent>
      </div>
    </PanelLayout>
  );
};

export default Profile;
