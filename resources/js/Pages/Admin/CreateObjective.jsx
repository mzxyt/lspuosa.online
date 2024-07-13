import { RequirementsEntryForm } from "@/Components/RequirementsEntryForm";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, router, useForm } from "@inertiajs/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { toast } from "sonner";

function CreateObjective({ auth, classifications, campuses }) {
  const [classificationIndex, setClassificationIndex] = useState(null);
  const { data, setData, processing, post } = useForm({
    title: "",
    submission_bin_id: null,
    objective_type: 0,
    campus_id: null,
    due_date: "",
  });

  console.log(campuses);
  const [requirements, setRequirements] = useState([]);
  const [submissionBins, setSubmissionBins] = useState([]);

  // get all submission bins
  // const fetchSubmissionBins = () => {
  //   submission-bins.open

  const fetchSubmissionBins = () => {
    axios
      .get(route("submission-bins.not-closed"))
      .then((res) => {
        console.log("testasdasd", res.data);
        setSubmissionBins(res.data);
      })
      .catch((error) => console.log("error getting submission bins ", error));
  };

  useEffect(() => {
    fetchSubmissionBins();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (requirements.length == 0 && data.objective_type == 0) {
      toast.error("Please add requirements for self checkout objective");
      return;
    }

    router.post(route("objectives.store"), {
      ...data,
      requirements,
      classificationIndex,
    });
  };

  return (
    <PanelLayout
      userAuth={auth}
      layout={LayoutType.SUPER_ADMIN}
      headerTitle="Create Target"
    >
      <div className="py-3">
        <div className="container-fluid">
          <Card className="border-0 shadow-sm p-2 p-lg-3">
            <Card.Body>
              <p className="text-2xl tracking-tight font-semibold">
                New Target
              </p>
              <Form onSubmit={(e) => handleSubmit(e)}>
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

                {/* select campus */}
                <div className="mb-3">
                  <Form.Label className="text-secondary">Campus:</Form.Label>
                  <Form.Select
                    required
                    defaultValue={""}
                    onChange={(e) => setData("campus_id", e.target.value)}
                  >
                    <option value={""} disabled>
                      Select Campus
                    </option>
                    {campuses.map((campus) => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className="mb-3">
                  <Form.Label className="text-secondary">
                    Designation:
                  </Form.Label>
                  <Form.Select
                    required
                    defaultValue={""}
                    onChange={(e) =>
                      setClassificationIndex(parseInt(e.target.value))
                    }
                  >
                    <option value={""} disabled>
                      select classification
                    </option>
                    {classifications &&
                      classifications.map((c, index) => (
                        // select classification

                        <optgroup key={index + 1} label={c.name}>
                          {c.designations.map((desig, i) => (
                            <option value={desig.id} key={desig.id}>
                              {desig.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                  </Form.Select>
                </div>

                {/* due date */}
                <div className="mb-3">
                  <Form.Label className="text-secondary">Due Date:</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={data.due_date}
                    onChange={(e) => setData("due_date", e.target.value)}
                  />
                </div>

                {/* objective type radio button here 2 types : 0 - self checkout, 1 - submission */}
                <div className="mb-3">
                  <Form.Label className="text-secondary">
                    Target Type:
                  </Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Self Checkout"
                      defaultChecked
                      name="objective_type"
                      value="0"
                      onChange={(e) =>
                        setData("objective_type", e.target.value)
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="Submission"
                      name="objective_type"
                      value="1"
                      onChange={(e) =>
                        setData("objective_type", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* if it is submissipe */}
                {data.objective_type == 1 ? (
                  <div className="mb-3">
                    <Form.Label className="text-secondary">
                      Submission Bin:
                    </Form.Label>
                    <Form.Select
                      required
                      defaultValue={""}
                      onChange={(e) =>
                        setData("submission_bin_id", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Submission Bin
                      </option>
                      {/* loop through submission bins */}
                      {submissionBins.map((bin) => (
                        <option key={bin.id} value={bin.id}>
                          {bin.title}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                ) : (
                  <RequirementsEntryForm
                    requirements={requirements}
                    setRequirements={setRequirements}
                  />
                )}

                <div className="text-end mt-3 flex items-center justify-end gap-3">
                  <Link
                    className="link link-secondary text-sm text-decoration-none"
                    href={route("admin.objectives")}
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
}

export default CreateObjective;
