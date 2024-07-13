import ElegantNav from "@/Components/ElegantNav";
import HeaderTitle from "@/Components/HeaderTitle";
import TextProfilePic from "@/Components/TextProfilePic";
import UnitHeadReportCard from "@/Components/UnitHeadReportCard";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Placeholder,
  Row,
  Spinner,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { ReportImages } from "./ReportTableRow";

const ViewReports = ({ submissionBin, campuses }) => {
  const { auth } = usePage().props;
  const [selectedCampus, setSelectedCampus] = useState(
    auth.role === "admin" ? auth.user.campus : campuses[0]
  );
  const [reports, setReports] = useState([]);
  const [fetchingReports, setFetchingReports] = useState(false);
  const [fetchingUnitHeads, setFetchingUnitHeads] = useState(true);
  const [unitHeads, setUnitHeads] = useState([]);
  const [selectedUnitHead, setSelectedUnitHead] = useState(null);
  const tableColumns = [
    {
      name: "Unit Head",
      selector: (row) => row.unit_head.firstname + " " + row.unit_head.lastname,
    },
  ];
  const fetchReports = async () => {
    setFetchingReports(true);
    var reports = {};

    if (auth.role === "admin") {
      reports = await axios.get(
        route("reports.all.index", [
          selectedCampus.id,
          submissionBin.id,
          selectedUnitHead.id,
        ])
      );
    } else {
      // if superadmin only get reports that were approved
      reports = await axios.get(
        route("reports.approved.index", [
          selectedCampus.id,
          submissionBin.id,
          selectedUnitHead.id,
        ])
      );
    }
    console.log("reports: ", reports);
    let unitHeads = await axios.get(
      route("reports.unit_heads.index", selectedCampus.id)
    );

    setReports(reports?.data?.reports || []);
    setUnitHeads(unitHeads.data.unitHeads);
    setFetchingReports(false);
  };

  useEffect(() => {
    const getUnitHeads = async () => {
      setFetchingUnitHeads(true);
      let unitHeads = await axios.get(
        route("reports.unit_heads.index", selectedCampus.id)
      );
      setUnitHeads(unitHeads.data.unitHeads);
      if (unitHeads.data.unitHeads.length > 0 && selectedUnitHead == null) {
        setSelectedUnitHead(unitHeads.data.unitHeads[0]);
      }
      setFetchingUnitHeads(false);
    };

    getUnitHeads();
  }, [selectedCampus]);

  useEffect(() => {
    if (selectedUnitHead) {
      fetchReports();
    }
  }, [selectedCampus, selectedUnitHead]);

  const openReport = (report) => {
    router.visit(route("admin.report.open", { report_id: report.id }));
  };

  return (
    <PanelLayout
      pageTitle="View Reports"
      defaultActiveLink="submission-bins"
      headerTitle={<HeaderTitle backButton text="Unit Head Report" />}
    >
      <div className="content-wrapper">
        <Card className="mb-3 border-0 shadow-sm rounded-md">
          <Card.Body className="p-4">
            <p className="text-2xl font-semibold m-0 tracking-tight">
              {submissionBin.title}
            </p>
            <div className="text-secondary">
              {submissionBin.deadline_date ? (
                <p className="text-sm m-0">
                  Due on{" "}
                  {format(
                    new Date(submissionBin.deadline_date),
                    "MMM d, Y / hh:mm aaa"
                  )}
                </p>
              ) : (
                <p className="mt-3 mb-0 text-sm">No deadline.</p>
              )}
            </div>

            {submissionBin.instruction ? (
              <div className="mt-2">
                <div className="font-semibold mb-2">Instruction:</div>
                <p className="whitespace-pre-wrap text-slate-600 my-1">
                  {submissionBin.instruction}
                </p>
              </div>
            ) : (
              <p className="text-sm text-black-50 my-1">No instruction.</p>
            )}
          </Card.Body>
        </Card>
        <Card className="border-0 shadow-sm rounded-md">
          <Card.Body className="p-lg-4">
            {auth.role === "super_admin" && (
              <>
                <p className="text-xl font-semibold m-0 tracking-tight">
                  Submitted Reports
                </p>
                <p className="text-sm text-slate-500">
                  View submitted reports for this submission bin.
                </p>

                <div>
                  {reports.map((report, i) => (
                    <div
                      key={i}
                      className="flex gap-3  p-4 border border-slate-200 rounded-md"
                    >
                      <img
                        src={report.unit_head.image}
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-lg tracking-tight font-bold m-0">
                              {report.unit_head.firstname}{" "}
                              {report.unit_head.lastname}
                            </p>
                            <div className="mt-1 flex gap-2 rounded-sm text-sm font-semibold">
                              <p className="m-0 rounded-md border border-slate-200 px-2 py-1">
                                {report.unit_head.campus.name} campus
                              </p>
                              <p className="m-0 rounded-md border border-slate-200 px-2 py-1">
                                {report.unit_head.designation.name} office
                              </p>
                            </div>
                          </div>

                          <Link
                            href={route("admin.report.open", report.id)}
                            className="text-sm px-2.5 hover:bg-slate-50 active:bg-slate-100 py-1.5 rounded-md text-indigo-600 border border-slate-200 shadow-sm"
                          >
                            View full report
                          </Link>
                        </div>
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
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default ViewReports;
