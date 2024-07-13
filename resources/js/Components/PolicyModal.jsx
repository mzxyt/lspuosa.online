import React from "react";
import ModalComponent from "./ModalComponent";
import { useState } from "react";
import { Button, Form, Modal, Placeholder } from "react-bootstrap";
import { useEffect } from "react";
import axios from "axios";
import { TextButton } from "./CustomBtn";
import { createElement } from "react";
import { router } from "@inertiajs/react";

const PolicyModal = ({ show, handleClose }) => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(false);
  const [read, setRead] = useState(false);

  useEffect(() => {
    const fetchPolicy = () => {
      axios.get(route("policy")).then((res) => {
        setPrivacyPolicy(res.data.policy);
        setProcessing(false);
      });
    };
    fetchPolicy();
  }, []);

  const parseQuill = (jsxString) => {
    // let element = createElement('div');
    // element.innerHTML = jsxString;
    return <div dangerouslySetInnerHTML={{ __html: jsxString }} />;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (read) {
      setError(false);
      router.post(
        route("policy.read"),
        {},
        {
          onFinish: () => handleClose(),
        }
      );
    } else {
      setError(true);
    }
  };

  return (
    <>
      <Modal
        className=""
        handleClose={handleClose}
        show={show}
        size="xl"
        // backdrop={processing}
      >
        <Modal.Header className="bg-primary text-light fw-bold fs-6 rounded-1 py-3 px-4">
          Privacy Policy
        </Modal.Header>
        <Modal.Body className="p-3 p-lg-4  bg-light">
          {processing ? (
            <div className="">
              <div className="mb-3">
                <Placeholder animation="wave">
                  <Placeholder bg="secondary" xs={12} />
                  <Placeholder bg="secondary" xs={11} />
                  <Placeholder bg="secondary" xs={12} />
                </Placeholder>
              </div>
              <div className="mb-3">
                <Placeholder animation="wave">
                  <Placeholder bg="secondary" xs={11} />
                  <Placeholder bg="secondary" xs={12} />
                  <Placeholder bg="secondary" xs={12} />
                </Placeholder>
              </div>
              <div className="mb-3">
                <Placeholder animation="wave">
                  <Placeholder bg="secondary" xs={11} />
                  <Placeholder bg="secondary" xs={12} />
                  <Placeholder bg="secondary" xs={12} />
                </Placeholder>
              </div>
              <div className="mb-3">
                <Placeholder animation="wave">
                  <Placeholder bg="secondary" xs={12} />
                  <Placeholder bg="secondary" xs={11} />
                  <Placeholder bg="secondary" xs={12} />
                </Placeholder>
              </div>
              <div className="mb-3">
                <Placeholder animation="wave">
                  <Placeholder bg="secondary" xs={12} />
                  <Placeholder bg="secondary" xs={11} />
                  <Placeholder bg="secondary" xs={12} />
                </Placeholder>
              </div>
            </div>
          ) : (
            <div className="ql-editor">{parseQuill(privacyPolicy)}</div>
          )}
        </Modal.Body>
        <Modal.Footer className=" d-block px-lg-4 px-2">
          {/* <Button type='button' onClick={handleClose} className='px-4 btn-sm rounded-1 '>
                        <span className="text-sm">Okay</span>
                    </Button> */}
          <div>
            <Form onSubmit={onSubmit}>
              <div className="flex justify-between items-center">
                <Form.Check // prettier-ignore
                  type="checkbox"
                  id={`check-agree`}
                  value={read}
                  onChange={(e) => setRead(e.target.checked)}
                  label="I have read and understand the privacy policy presented above."
                  className="[&>input]:border-slate-400"
                  required
                />
                <TextButton type="submit" allCaps={false}>
                  Confirm
                </TextButton>
              </div>
            </Form>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PolicyModal;
