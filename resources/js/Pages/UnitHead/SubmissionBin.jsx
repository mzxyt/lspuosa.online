import CommentsView from "@/Components/CommentsView";
import FileIcon from "@/Components/FileIcon";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import React, { useState } from "react";
import { Card, Col, Form, FormCheck, Row } from "react-bootstrap";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@/Components/Checkbox";
import { SubmissionBinEntryForm } from "../Admin/SubmissionBinEntryForm";
import dayjs from "dayjs";
import Flickity from "react-flickity-component";
import { ReportImages } from "../Admin/ReportTableRow";

export const statusColors = {
  Pending: "text-slate-800",
  Resubmitted: "text-blue-600",
  Rejected: "text-rose-600",
  Approved: "text-green-700",
};

export const statusIcons = {
  Pending: "fi-ss-check-circle",
  Resubmitted: "fi-ss-check-circle",
  Rejected: "fi-ss-circle-xmark",
  Approved: "fi-ss-check-circle",
};

const SubmissionBin = ({ submissionBin, auth, report }) => {
  const [showFileModal, setShowFileModal] = useState(false);
  const [viewFile, setViewFile] = useState(null);

  const showFile = (file) => {
    setViewFile(file);
    setShowFileModal(true);
  };

  // fi-sr-circle-xmark

  console.log(report);

  return (
    <PanelLayout
      defaultActiveLink="reports"
      headerTitle={"Accomplishment Report"}
    >
      <div className="content-wrapper">
        <Card className="rounded-3 border-0 shadow-sm ">
          <Card.Body className="p-0">
            <div className="flex space-y-4 flex-col p-4 pb-2">
              <div>
                <p className="text-2xl font-semibold m-0 tracking-tight">
                  {submissionBin.title}
                </p>
                <p className="m-0 text-slate-600">
                  {auth.user.campus.name} campus,{" "}
                  {submissionBin.deadline_date ? (
                    <>
                      Due on{" "}
                      {format(
                        new Date(
                          submissionBin.deadline_date +
                            " " +
                            submissionBin.deadline_time
                        ),
                        "MMM d, Y / hh:mm aaa"
                      )}
                    </>
                  ) : (
                    "No deadline"
                  )}
                </p>
              </div>

              {report ? (
                <div>
                  <span className="mr-4 items-start gap-2.5 w-max flex pl-3.5 pr-2.5 py-1.5 border border-slate-300 rounded-md">
                    <i
                      className={`fi mt-0.5 ${statusIcons[report.status]} ${
                        statusColors[report.status]
                      }`}
                    ></i>
                    <div>
                      <p
                        className={`text-sm font-bold m-0 ${
                          statusColors[report.status]
                        }`}
                      >
                        {report.status}
                      </p>
                    </div>
                    <p className="text-slate-500 text-sm font-medium m-0">
                      - {report.remarks}
                    </p>
                  </span>
                </div>
              ) : null}
            </div>
            <div className="p-4 py-2">
              <div className="font-semibold mb-2">Instruction:</div>

              {submissionBin.instruction ? (
                <>
                  <p className="text-slate-600 my-1 whitespace-pre-wrap">
                    {submissionBin.instruction}
                  </p>
                </>
              ) : (
                <p className="text-slate-600 mb-1">No instruction.</p>
              )}
            </div>

            <hr className="border-t border-slate-400" />
            <div className="p-4 pt-0">
              <div className="font-semibold mb-2">
                Attached reference{" "}
                {submissionBin.attachments.length > 1 ? "files" : "file"}:
              </div>
              <div className="flex flex-wrap gap-2">
                {submissionBin.attachments.length ? (
                  submissionBin.attachments.map((attachment) => (
                    <a
                      title={`Download this file`}
                      target="_blank"
                      download={true}
                      href={attachment.uri}
                      className="border-[1px] space-x-2 w-max flex border-slate-200 p-2 pr-4 hover:bg-slate-100 rounded-md text-indigo-600 font-semibold text-sm"
                    >
                      <FileIcon file={attachment} size="xs" />
                      <span>{attachment.name}</span>
                    </a>
                  ))
                ) : (
                  <p className="mb-0 text-slate-500">No attached file.</p>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        {/* report comments */}
        <Row className="!mt-8">
          <Col className="space-y-8">
            {report && report.status !== "Rejected" ? (
              <Card className="rounded-3 border-0 bg-white shadow-sm p-4">
                <p className="tracking-tight text-2xl font-semibold m-0">
                  {report && report.status === "Rejected"
                    ? "Edit your"
                    : "Submitted"}{" "}
                  reports
                </p>
                <p className="text-sm text-slate-500 mb-4 m-0">
                  Check your submitted reports
                </p>

                <div className="p-0 border border-slate-200 rounded-md overflow-hidden">
                  <table className="border-collapse w-full">
                    <thead>
                      <tr className="[&>th]:border-l [&>th:first-child]:border-0 [&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                        <th>Title of Activities/ Program</th>
                        <th>Date/ Duration</th>
                        <th>Documentation (Pictures)</th>
                        <th>Participants</th>
                        <th>Location</th>
                        <th>Conducted/ Sponsored by:</th>
                        <th className="text-center">Budget/Remark</th>
                      </tr>
                    </thead>

                    <tbody>
                      {report.entries.map((entry, index) => (
                        <ReportImages key={index} entry={entry} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <SubmissionBinEntryForm
                report={report}
                submissionBinId={submissionBin.id}
              />
            )}
            <Card className="rounded-3 border-0 bg-white shadow-sm">
              <Card.Body>
                <p className="my-1">Private Comments</p>
                <div className="mt-4">
                  {console.log(report)}
                  <CommentsView
                    report={report}
                    unitHead={auth.user}
                    user={auth.user}
                    submissionBin={submissionBin}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PanelLayout>
  );
};

export default SubmissionBin;
