import ImageUploader from "@/Components/ImageUploader";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Alert, Button, Card, Form, Image } from "react-bootstrap";

const CreateAnnouncement = ({ auth }) => {
  const [count, setCount] = useState(0);
  const [images, setImages] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const { data, setData, processing, post } = useForm({
    title: "",
    content: "",
    images: "",
  });

  const handleImageRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1); // Remove the image at the specified index
    setImages(newImages);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    data.images = images;
    post(route("announcements.create"));
  };

  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePreviewModal = (image) => {
    setSelectedImage(image);
    setShowImagePreviewModal(true);
  };

  const closeImagePreviewModal = () => {
    setSelectedImage(null);
    setShowImagePreviewModal(false);
  };

  return (
    <PanelLayout
      userAuth={auth}
      layout={LayoutType.SUPER_ADMIN}
      headerTitle="Create Announcement"
      defaultActiveLink="announcements"
    >
      <ModalComponent
        centered
        size="lg"
        show={showImagePreviewModal}
        handleClose={closeImagePreviewModal}
      >
        <Image src={selectedImage} fluid />
      </ModalComponent>
      <ImageUploader
        closeOnComplete
        onCompleted={(imgUrl) => {
          setImages([...images, imgUrl]); // Add the uploaded image URL to the images array
          setShowUploader(false); // Close the uploader after image is uploaded
        }}
        show={showUploader}
        handleClose={() => setShowUploader(false)}
      />

      <div className="py-3">
        <div className="container-fluid">
          <Card className="border-0 shadow-sm p-2 p-lg-3">
            <Card.Body>
              <p className="form-text">New Announcement</p>
              <hr />
              <Form onSubmit={onSubmit}>
                <div className="mb-3">
                  <Form.Label className="text-secondary">Title:</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="Enter title here..."
                  />
                </div>
                <div className="mb-3">
                  <Form.Label className="text-secondary">Content:</Form.Label>
                  <textarea
                    className="form-control"
                    onChange={(e) => setData("content", e.target.value)}
                    rows={3}
                  ></textarea>
                </div>
                <div className="mt-3">
                  <Button
                    onClick={() => setShowUploader(true)}
                    size="sm"
                    className="rounded-1 mb-3 btn-light-primary"
                  >
                    <span className="text-sm">Upload Image</span>
                  </Button>
                  <div className="flex">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="col-lg-4   overflow-hidden m-3 h-[20rem]  border hover:shadow-inner position-relative"
                      >
                        <div
                          className="cursor-pointer  opacity-30 position-absolute w-full h-full top-0 left-0 hover:opacity-10 hover:shadow transition-all"
                          onClick={() => {
                            openImagePreviewModal(image);
                          }}
                        ></div>
                        <Image src={image} fluid />
                        {/* remove button */}
                        <div
                          onClick={() => handleImageRemove(index)}
                          className="position-absolute bottom-2 right-2 px-2 py-1 cursor-pointer bg-white rounded-full"
                        >
                          <i className="bx bx-x text-danger"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-end mt-3 flex items-center justify-end gap-3">
                  <Link
                    className="link link-secondary text-sm text-decoration-none"
                    href={route("admin.announcements")}
                  >
                    <i className="fi fi-rr-arrow-back"></i> Cancel
                  </Link>
                  <Button className="rounded-1 btn-primary " type="submit">
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-sm">Submit</span>
                      <i className="bx bx-right-arrow-alt leading-none"></i>
                    </div>
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
};

export default CreateAnnouncement;
