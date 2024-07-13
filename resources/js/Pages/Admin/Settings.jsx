import ConfirmModal from "@/Components/ConfirmModal";
import PanelLayout from "@/Layouts/PanelLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import React from "react";
import { useState } from "react";
import { Button, Card, Form, Image } from "react-bootstrap";
import ReactQuill from "react-quill";

const Settings = ({ settings }) => {
  const [logo, setLogo] = useState(settings?.logo);
  const [isUploading, setIsUploading] = useState(false);
  const { data, setData, patch } = useForm({
    logo: settings.logo,
    policy: settings.policy ?? "",
  });
  const { auth } = usePage().props;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const onLogoSelect = (e) => {
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      let formData = new FormData();
      formData.append("image", file);
      setIsUploading(true);
      axios
        .post(route("image.upload"), formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          setData("logo", res.data.imageUrl);
          setIsUploading(false);
        })
        .catch((err) => {
          console.error("error uploading image: ", err);
          setIsUploading(false);
        });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    patch(route("settings.update", { id: settings.id }));
  };

  const resetSuperAdmin = () => {
    axios.delete(route("super_admin.destroy", auth.user.id)).then((res) => {
      router.visit(route("admin.register"));
    });
  };

  return (
    <PanelLayout
      headerTitle={
        <div className="flex items-center gap-2">
          <i className="fi fi-rr-settings"></i>
          <span>Settings</span>
        </div>
      }
      defaultActiveLink={"settings"}
    >
      <Head title="Settings" />
      <div className="content-wrapper">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-lg-4 p-3">
            <Form onSubmit={onSubmit}>
              <Image src={data.logo} width={110} fluid className="mb-3" />
              <Form.Label className=" text-dark fw-semibold">
                {isUploading ? "Uploading image..." : "App Logo:"}
              </Form.Label>
              <div className="flex mb-4">
                <Form.Control
                  disabled={isUploading}
                  onChange={onLogoSelect}
                  type="file"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setLogo(settings?.logo);
                  }}
                >
                  Reset
                </Button>
              </div>
              <div className="mb-3">
                <Form.Label className="fw-bold">Privacy Policy</Form.Label>
                {/* <textarea
                                    value={data.policy}
                                    onChange={e => setData('policy',e.target.value)}
                                    className='form-control'
                                    rows={10}
                                >
                                </textarea> */}
                <ReactQuill
                  theme="snow"
                  value={data.policy}
                  onChange={(value) => setData("policy", value)}
                />
              </div>

              <hr />
              <div className=" mt-3">
                <Button className="rounded-1" variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        {auth.role === "super_admin" && (
          <>
            <ConfirmModal
              title="Remove your role as super admin?"
              show={showConfirmModal}
              handleClose={() => setShowConfirmModal(false)}
              onConfirm={resetSuperAdmin}
              onCancel={() => setShowConfirmModal(false)}
            />
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body className="p-4">
                <h5 className="font-bold">Reset super admin</h5>
                <p>
                  This action cannot be undone and will delete your account
                  permanently.
                </p>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="mt-3 hover:bg-rose-700 hover:text-white hover:border-transparent transition border-[1px] border-rose-500 rounded-md px-3 py-2 font-medium text-rose-700"
                >
                  Reset now
                </button>
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </PanelLayout>
  );
};

export default Settings;
