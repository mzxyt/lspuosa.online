import PanelLayout from "@/Layouts/PanelLayout";
import React from "react";
import {
  Accordion,
  Button,
  Card,
  Container,
  Placeholder,
  useAccordionButton,
} from "react-bootstrap";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { useState } from "react";

const UnitHeadReports = ({ submissionBins: bins, auth, rows, reports }) => {
  const [hasRows, setHasRows] = useState(rows > 10);
  const [submissionBins, setSubmissionBins] = useState([...bins]);
  const [lastRowId, setLastRowId] = useState(
    bins.length == 0 ? 0 : bins[bins.length - 1]?.id
  );
  const [fetching, setFetching] = useState(false);

  const fetchSubmissionBins = () => {
    setFetching(true);
    axios.get(route("submission-bins.index", lastRowId)).then((res) => {
      let bins = res.data.submissionBins;
      setLastRowId(bins[bins.length - 1].id);
      setTimeout(() => {
        setFetching(false);
        setSubmissionBins((prev) => [...prev, ...bins]);
        setHasRows(res.data.hasRows);
        console.log(res);
      }, 1500);
    });
  };

  const hasSubmitted = (bin) => {
    for (let report of reports) {
      if (bin.id == report.submission_bin_id) {
        if (report.is_submitted && report.status != "Rejected") {
          return true;
        }
        break;
      }
    }

    return false;
  };

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <div
        className="col-12 bg-transparent cursor-pointer border-0 text-left py-[1.2rem] px-2"
        onClick={decoratedOnClick}
      >
        {children}
      </div>
    );
  }
  return (
    <PanelLayout
      defaultActiveLink={"reports"}
      headerTitle={"Accomplishment Reports"}
    >
      <div className="content-wrapper">
        <p className="fs-6 text-primary">{auth.user?.campus?.name} Campus</p>
        <hr />
        {submissionBins.length === 0 && (
          <p className="text-center">
            No posted submission bins at this moment, stay tuned
          </p>
        )}
        <Accordion defaultActiveKey="0">
          {submissionBins &&
            submissionBins.map((item, index) => (
              <Card className="border-0 mb-1 shadow-sm">
                <Card.Header className="bg-white">
                  <CustomToggle eventKey={index}>
                    <div className="row">
                      <div className="col">
                        <div className="flex items-center gap-3 text-secondary">
                          {hasSubmitted(item) ? (
                            <i className="fi fi-rr-check-circle text-success fs-5"></i>
                          ) : (
                            <i className="fi fi-rr-box fs-5"></i>
                          )}
                          <span className="fw-bold">{item.title}</span>
                        </div>
                      </div>
                      <div className="col-auto text-end">
                        <div className="flex justify-end items-center gap-2">
                          {item.deadline_date && (
                            <p className="my-0 text-sm text-secondary">
                              Due{" "}
                              {format(
                                new Date(item.deadline_date),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                  <>
                    <Card.Body className="p-4">
                      <p className="mt-0 mb-3 text-sm text-secondary">
                        <small>
                          Created on{" "}
                          {format(new Date(item.created_at), "MMM dd, yyyy")}
                        </small>
                      </p>
                      <p className="text-sm">
                        {item.instruction || "No instruction."}
                      </p>
                    </Card.Body>
                    <Card.Footer className="bg-white py-3">
                      <div className="flex items-center justify-between">
                        <Link
                          className="rounded-1 text-sm btn btn-light"
                          href={route("unit_head.submission_bin", {
                            id: item.id,
                          })}
                        >
                          <small>Open Submission Bin</small>
                        </Link>
                      </div>
                    </Card.Footer>
                  </>
                </Accordion.Collapse>
              </Card>
            ))}
        </Accordion>
        {fetching && (
          <>
            <Placeholder as="div" animation="wave" className="my-0 ">
              <div className="col-12 bg-white shadow-sm h-[60px]">
                <Container>
                  <Placeholder as="p" animation="wave" className="my-0 ">
                    <Placeholder xs={5} bg="light" />
                  </Placeholder>
                  A
                </Container>
              </div>
            </Placeholder>
          </>
        )}
        {hasRows && (
          <div className="text-center my-2">
            <Button
              disabled={fetching}
              variant="light"
              className="text-primary fw-bold"
              onClick={fetchSubmissionBins}
            >
              {fetching ? "Load more..." : "Load more"}
            </Button>
          </div>
        )}
      </div>
    </PanelLayout>
  );
};

export default UnitHeadReports;
