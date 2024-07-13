import axios, { Axios } from "axios";
import React, { useState } from "react";
import { Modal, Button, FormLabel, Form } from "react-bootstrap";

const ImageUploader = ({
  show,
  handleClose,
  onCompleted,
  closeOnComplete = false,
}) => {
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const onChange = (e) => {
    setIsUploading(true);
    let files = e.target.files;
    if (files.length > 0) {
      let formData = new FormData();
      formData.append("image", files[0]);
      axios
        .post(route("image.upload"), formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("uploading image res: ", res);
          onCompleted(res.data.imageUrl);
          setIsUploading(false);
          if (closeOnComplete) {
            handleClose();
          }
        })
        .catch((err) => {
          console.error("error uploading image: ", err);
          setIsUploading(false);
          if (closeOnComplete) {
            handleClose();
          }
        });
    }
  };

  return (
    <>
      <Modal
        backdrop={isUploading ? "static" : "backdrop"}
        centered
        size="md"
        className="image-uploader-modal"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton className="bg-light-secondary">
          <Modal.Title className=" fs-5">Media Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <div
            className={`image-uploader h-100 ${isUploading ? "uploading" : ""}`}
          >
            <div className=" text-center text-secondary">
              <div>
                <p>
                  <i className=" bx bx-image bx-md"></i>
                </p>
                <p className="fs-6 fw-bold">
                  {isUploading
                    ? "Uploading image..."
                    : "Click to upload or drop an image here."}
                </p>
                <p className="text-sm text-black-50">JPG, PNG or GIF. </p>
              </div>
            </div>
            {/* <Form.Control onChange={onChange} accept='image/*' type='file' value={image}/> */}
            <input
              onChange={onChange}
              accept="image/*"
              id="image-input"
              className="image-uploader-input"
              type="file"
              value={image}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light-secondary"
            disabled={isUploading}
            onClick={handleClose}
            className="col-12"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImageUploader;
