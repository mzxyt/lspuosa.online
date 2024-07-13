import { CampusForReviewTable } from "@/Components/CampusForReviewTable";
import HeaderTitle from "@/Components/HeaderTitle";
import ModalComponent from "@/Components/ModalComponent";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { usePDF } from "react-to-pdf";
import { ReportImages } from "./ReportTableRow";
import DataTable from "react-data-table-component";

export default function CampusForReviewReports({ campus, reports, entries }) {
  const [showExportPDF, setShowExportPDF] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "REPORT.pdf" });
  const { auth, appLogo } = usePage().props;

  const columns = [
    {
      name: "Name",
      selector: (row) => row.unit_head.firstname + " " + row.unit_head.lastname,
      sortable: true,
      width: "auto",
      cell: (row) => (
        <div className="flex items-center">
          {/* firstname and lastname */}
          <div className="flex flex-col">
            <span>{row.unit_head.firstname}</span>
            <span>{row.unit_head.lastname}</span>
          </div>
        </div>
      ),
    },

    // Date Submitted
    {
      name: "Date Submitted",
      selector: (row) => dayjs(row.created_at).format("MMM. D, YYYY"),
      sortable: true,
      width: "auto",
      cell: (row) => (
        <span>{dayjs(row.created_at).format("MMM. D, YYYY")}</span>
      ),
    },

    // Campus
    {
      name: "Campus",
      selector: (row) => row.unit_head.campus.name,
      sortable: true,
      width: "auto",
      cell: (row) => <span>{row.unit_head.campus.name}</span>,
    },

    // Office
    {
      name: "Office",
      selector: (row) => row.unit_head.designation.name,
      sortable: true,
      width: "auto",
      cell: (row) => <span>{row.unit_head.designation.name}</span>,
    },

    // Action
    {
      name: "Action",
      selector: (row) => row.id,
      width: "auto",
      cell: (row) => (
        <div className="flex flex-col">
          <Link
            href={route("admin.report.open", row.id)}
            className="hover:underline"
          >
            View Reports
          </Link>
          {row.is_archived === 0 ? (
            <Link
              onClick={() => {
                axios.put(route("admin.report.archive", row.id)).then((res) => {
                  console.log("archive:", res);
                });
              }}
              className="block hover:underline mt-2"
            >
              Archive
            </Link>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        padding: "10px 20px",
        fontSize: "14px",
        background: "#f8fafc",
        borderBottom: "1px solid #000000",
        borderTop: "1px solid #000000",
        fontWeight: 700,
        color: "#475569",
        width: "auto", // Set width to auto for full width
      },
    },
    cells: {
      style: {
        padding: "10px 20px",
        fontSize: "14px",

        borderBottom: "1px solid #000000",
        wordBreak: "break-all",
        minWidth: "150px", // Set a minimum width to prevent text from being cut off
        maxWidth: "500px", // Set a maximum width to prevent excessive stretching
        whiteSpace: "pre-wrap", // Wrap text
      },
    },
  };

  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      defaultActiveLink="for review"
      pageTitle="Reports | For review"
      headerTitle={
        <HeaderTitle
          text={"Review reports for " + campus}
          backButton
          backButtonLink={route("admin.reports.for-review")}
        />
      }
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-none">
            For review reports for {campus}
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports that needs to be reviewed.
          </p>

          <ModalComponent
            className={"rounded-0 bg-transparent"}
            bodyClassname="p-0 overflow-auto"
            show={showExportPDF}
            handleClose={() => setShowExportPDF((s) => !s)}
            closeButton
            title={"Export to PDF"}
            size="fullscreen"
          >
            <header className="gap-3 p-3 flex justify-center border-b border-slate-200">
              <button
                onClick={() => toPDF()}
                className="px-2.5 py-1 hover:bg-slate-50 focus:outline-slate-500 outline outline-2 outline-offset-2 outline-transparent font-medium shadow-sm shadow-slate-400/10 border border-slate-200 rounded-md text-sm active:bg-slate-100"
              >
                Export to PDF{" "}
                <span className="font-mono text-slate-500">(.pdf)</span>
              </button>
            </header>
            <div
              ref={targetRef}
              className="flex flex-col items-center justify-center px-10"
            >
              <div className="max-w-screen-2xl pt-8 w-full mx-auto items-center flex">
                <div className="flex-1 flex justify-center">
                  <img src={appLogo} className="w-28 h-28" />
                </div>

                <div className="flex-[2] text-center">
                  <p className="text-xl m-0">Republic of the Philippines</p>
                  <p className="text-4xl mb-1 font-serif tracking-tight">
                    Laguna State Polytechnic University
                  </p>
                  <p className="text-xl  m-0">Province of Laguna</p>
                </div>

                <div className="flex-1 flex justify-end">
                  <img src={"/images/cert.png"} className="w-auto h-28" />
                </div>
              </div>
              <div className="max-w-6xl pt-8 w-full mx-auto">
                <p className="m-0 text-4xl font-bold font-serif text-center">
                  ACCOMPLISHMENT REPORT OF ALL UNITS
                </p>
                <p className="m-0 mt-1 font-semibold text-xl tracking-tight uppercase text-center">
                  LSPU {auth.role === "admin" ? auth.user.campus.name : "all"}{" "}
                  Campus
                </p>
              </div>

              <div className="min-w-[1700px]  max-w-[1800px] pb-10 mx-auto">
                <div className="p-0 mt-4 border border-black overflow-hidden">
                  <table className="border-collapse w-full">
                    <thead>
                      <tr className="[&>th]:border-l border-black [&>th:first-child]:border-0 [&>th]:text-black [&>th]:bg-green-200 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:font-bold uppercase text-center">
                        <th>Title of Activities/ Program</th>
                        <th>Date/ Duration</th>
                        <th>Documentation (Pictures)</th>
                        <th>Participants</th>
                        <th>Location</th>
                        <th>Conducted/ Sponsored by</th>
                        <th>Budget/Remark</th>
                      </tr>
                    </thead>

                    <tbody>
                      {entries.map((entry, index) => (
                        <ReportImages
                          key={index}
                          entry={entry}
                          tdClass="[&>td]:text-xl text-center tracking-tight"
                          imgClass="max-h-60 w-auto"
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ModalComponent>

          <button
            onClick={() => setShowExportPDF(true)}
            className="px-2.5 py-1 font-medium shadow-sm shadow-slate-400/10 border border-slate-200 rounded-md text-sm"
          >
            Export Data
          </button>

          <div className="mt-4 rounded-md overflow-hidden">
            <DataTable
              columns={columns}
              data={reports}
              pagination
              className="w-full"
              customStyles={customStyles}
              scrollX={true}
              scrollY={true}
              paginationRowsPerPageOptions={[1, 5, 100, 300, 500, 800, 1000]}
            />
            {/* <table className="w-full">
              <thead>
                <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                  <th>Name</th>
                  <th>Date Submitted</th>
                  <th>Campus</th>
                  <th>Office</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.length ? (
                  reports.map((report, i) => (
                    <>
                      {report.is_archived === 0 ? (
                        <tr
                          key={report.id}
                          className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                        >
                          <td>
                            {report.unit_head.firstname}{" "}
                            {report.unit_head.lastname}
                          </td>
                          <td>
                            {dayjs(report.created_at).format("MMM. D, YYYY")}
                          </td>
                          <td>{report.unit_head.campus.name}</td>
                          <td>{report.unit_head.designation.name}</td>
                          <td>
                            <Link
                              href={route("admin.report.open", report.id)}
                              className="hover:underline"
                            >
                              View Reports
                            </Link>
                            {report.is_archived === 0 ? (
                              <Link
                                onClick={() => {
                                  axios
                                    .put(
                                      route("admin.report.archive", report.id)
                                    )
                                    .then((res) => {
                                      console.log("archive:", res);
                                    });
                                }}
                                className="block hover:underline mt-2"
                              >
                                Archive
                              </Link>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      ) : (
                        false
                      )}
                    </>
                  ))
                ) : (
                  <div className="text-slate-500 border-2 rounded-md border-dashed border-slate-200 py-8 text-center">
                    There are currently no reports submitted for this campus
                  </div>
                )}
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
