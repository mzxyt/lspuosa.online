import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { usePDF } from "react-to-pdf";
import ModalComponent from "./ModalComponent";
import { ReportImages } from "@/Pages/Admin/ReportTableRow";

export const CampusForReviewTable = ({ report }) => {
  const [showExportPDF, setShowExportPDF] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "REPORT.pdf" });
  const { auth, appLogo } = usePage().props;
  const officesArr = Object.keys(offices);

  const [totalReports, setTotalReports] = useState(() => {
    let totalCount = 0;

    if (officesArr.length) {
      officesArr.forEach((office) => {
        offices[office].forEach((report) => {
          if (report.is_archived === 0) {
            totalCount++;
          }
        });
      });
    }

    return totalCount;
  });

  return (
    <div className="mt-4">
      {/* <div className="pt-2 flex justify-between items-start border-zinc-200">
        <button
          onClick={() => setShowExportPDF(true)}
          className="px-2.5 py-1 font-medium shadow-sm shadow-slate-400/10 border border-slate-200 rounded-md text-sm"
        >
          Export Data
        </button>
      </div> */}
      <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full">
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
            {totalReports !== 0 ? (
              offices.map((report) => (
                <>
                  {/* <ModalComponent
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
                        Export to PDF
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
                          <p className="text-xl m-0">
                            Republic of the Philippines
                          </p>
                          <p className="text-4xl mb-1 font-serif tracking-tight">
                            Laguna State Polytechnic University
                          </p>
                          <p className="text-xl  m-0">Province of Laguna</p>
                        </div>

                        <div className="flex-1 flex justify-end">
                          <img
                            src={"/images/cert.png"}
                            className="w-auto h-28"
                          />
                        </div>
                      </div>
                      <div className="max-w-6xl pt-8 w-full mx-auto">
                        <p className="m-0 text-4xl font-bold font-serif text-center">
                          ACCOMPLISHMENT REPORT OF ALL UNITS
                        </p>
                        <p className="m-0 mt-1 font-semibold text-xl tracking-tight uppercase text-center">
                          LSPU{" "}
                          {auth.role === "admin"
                            ? auth.user.campus.name
                            : "all"}{" "}
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
                              {report.entries.map((entry, index) => (
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
                  </ModalComponent> */}

                  {report.is_archived === 0 ? (
                    <tr
                      key={report.id}
                      className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                    >
                      <td>
                        {report.unit_head.firstname} {report.unit_head.lastname}
                      </td>
                      <td>{dayjs(report.created_at).format("MMM. D, YYYY")}</td>
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
                                .put(route("admin.report.archive", report.id))
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
              <tr className="text-slate-500 text-center">
                <td colSpan={5} className="py-4">
                  There are currently no reports submitted for this campus
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
