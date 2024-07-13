import CommentsView from "@/Components/CommentsView";
import FileIcon from "@/Components/FileIcon";
import HeaderTitle from "@/Components/HeaderTitle";
import { formatDate } from "@/Components/Helper";
import ModalComponent from "@/Components/ModalComponent";
import TextProfilePic from "@/Components/TextProfilePic";
import PanelLayout from "@/Layouts/PanelLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import DocViewer, { DocViewerRenderers, PDFRenderer } from "react-doc-viewer";
import { ReportImages } from "./ReportTableRow";
import { statusColors } from "../UnitHead/SubmissionBin";

const ViewReport = ({ report }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { auth } = usePage().props;

  const approveReport = async (id) => {
    const res = await axios.patch(
      route("report.action.approve", {
        report_id: id,
        user_id: auth.user.id,
      })
    );
    if (res.data.message) {
      router.reload();
      toast.success(res.data.message);
    }
    return;
  };

  const rejectReport = async (id) => {
    const res = await axios.patch(
      route("report.action.reject", {
        report_id: id,
        user_id: auth.user.id,
      })
    );

    if (res.data.message) {
      router.reload();
      toast.success(res.data.message);
    }
    return;
  };

  console.log(auth.user);

  useEffect(() => {
    setSelectedFile(report.attachments[0]);
  }, []);

  return (
    <PanelLayout
      headerTitle={
        <HeaderTitle
          text={report.submission_bin.title}
          backButton
          backButtonLink={route(
            "admin.reports.for-review.campus",
            report.unit_head.campus.name
          )}
        />
      }
      defaultActiveLink="submission-bins"
    >
      <Head
        title={
          report.unit_head.firstname +
          " " +
          report.unit_head.lastname +
          " | " +
          report.submission_bin.title
        }
      />
      <div className="content-wrapper">
        <Row className="bg-transparent gy-2 gx-2">
          <Col>
            <Card className="border-0 shadow-sm rounded-xl p-2 mb-4">
              <Card.Body className="border-0 h-100">
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-semibold tracking-tight mb-0">
                    Submitted by
                  </p>
                  <div className="flex items-center">
                    {auth.role === "super_admin" || auth.role === "admin" ? (
                      <div className="text-end">
                        {report.status === "Approved" ? (
                          <>
                            <p className={`text-success fw-bold my-0`}>
                              <i className="bx bxs-check-circle me-2"></i>
                              {report.status}
                            </p>
                            <p
                              className={`text-sm my-0 ${
                                report.remarks.toLowerCase() ==
                                "submitted on time"
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              <small>{report.remarks}</small>
                            </p>
                          </>
                        ) : (
                          <p
                            className={`${
                              statusColors[report.status]
                            } fw-bold my-0 mr-4`}
                          >
                            {report.status}
                          </p>
                        )}
                      </div>
                    ) : null}

                    {report.status === "Pending" ||
                    report.status === "Resubmitted" ? (
                      <>
                        <button
                          onClick={() => approveReport(report.id)}
                          className="mr-2 transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectReport(report.id)}
                          className="transition bg-rose-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-rose-400 rounded-md"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex gap-x-4 w-100">
                  <div>
                    {report.unit_head.image ? (
                      <Image
                        src={report.unit_head.image}
                        width={50}
                        height={50}
                        roundedCircle
                      />
                    ) : (
                      <TextProfilePic
                        className="text-light"
                        size="sm"
                        text={report.unit_head.firstname[0]}
                      />
                    )}
                  </div>
                  <div className="w-100 ">
                    <p className="my-0 fw-bold">
                      {report.unit_head.firstname +
                        " " +
                        report.unit_head.lastname}
                    </p>
                    <p className="leading-none my-0 text-slate-500">
                      <small>Unit Head</small>
                    </p>
                    {/* <hr className='my-1' /> */}
                    {/* <p className=' mt-2 mb-0 text-sm text-dark'>
                                            {report.unit_head.campus.name} Campus
                                        </p> */}

                    <div className="mt-3 flex gap-3">
                      <div className="w-max transition rounded-md text-slate-800 text-center flex flex-col items-center justify-center px-6 py-3 border-[1px] border-slate-200">
                        <i className="fi fi-rr-cabin text-2xl mb-3 text-slate-500"></i>
                        <span className="font-bold uppercase">
                          {report.unit_head.campus.name}
                        </span>
                        <span className="text-sm text-slate-500">Campus</span>
                      </div>

                      <div className="w-max transition rounded-md text-slate-800 text-center flex flex-col items-center justify-center px-6 py-3 border-[1px] border-slate-200">
                        <i className="text-slate-500 fi fi-rr-city text-2xl mb-3"></i>
                        <span className="font-bold uppercase">
                          {report.unit_head.designation.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          Designation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm rounded-xl p-2 mb-4 ">
              <Card.Body className="h-100">
                <div className="flex justify-between">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight mb-1">
                      Reports
                    </p>
                    {report.is_submitted ? (
                      <>
                        {auth.role === "super_admin" ? (
                          report.status === "Approved" ? (
                            <p className="text-sm text-slate-500 my-0">
                              <span>
                                Submitted on{" "}
                                <b>
                                  {formatDate(new Date(report.date_submitted))}
                                </b>
                              </span>
                            </p>
                          ) : null
                        ) : (
                          <p className="text-sm text-slate-500 my-0">
                            <span>
                              Submitted on{" "}
                              <b>
                                {formatDate(new Date(report.date_submitted))}
                              </b>
                            </span>
                          </p>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="p-2">
                  {auth.role === "admin" ? (
                    <div className="row g-3">
                      {report.entries.length == 0 && <p>No submission yet.</p>}
                      <div className="p-0 mt-4 border border-slate-200 rounded-md overflow-hidden">
                        <table className="border-collapse w-full">
                          <thead>
                            <tr className="[&>th]:border-l [&>th:first-child]:border-0 [&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                              <th>Title of Activities/ Program</th>
                              <th>Date/ Duration</th>
                              <th>Documentation (Pictures)</th>
                              <th>Participants</th>
                              <th>Location</th>
                              <th>Conducted/ Sponsored by:</th>
                              <th>Budget/Remark</th>
                            </tr>
                          </thead>

                          <tbody>
                            {report.entries.map((entry, index) => (
                              <ReportImages entry={entry} key={index} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row g-3">
                        {report.entries.length == 0 && (
                          <p>No submission yet.</p>
                        )}
                        <div className="p-0 mt-4 border border-slate-200 rounded-md overflow-hidden">
                          <table className="border-collapse w-full">
                            <thead>
                              <tr className="[&>th]:border-l [&>th:first-child]:border-0 [&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                                <th>Title of Activities/ Program</th>
                                <th>Date/ Duration</th>
                                <th>Documentation (Pictures)</th>
                                <th>Participants</th>
                                <th>Location</th>
                                <th>Conducted/ Sponsored by:</th>
                                <th>Budget/Remark</th>
                              </tr>
                            </thead>

                            <tbody>
                              {report.entries.map((entry, index) => (
                                <ReportImages entry={entry} key={index} />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm rounded-xl">
              <Card.Body className="p-4 ">
                <p className="fw-bold text-slate-800 mb-0">Private Comments</p>
                <hr className="my-3 border-slate-400" />
                <CommentsView
                  report={report}
                  user={auth.user}
                  submissionBin={report.submission_bin}
                  unitHead={report.unit_head}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PanelLayout>
  );
};

export default ViewReport;
