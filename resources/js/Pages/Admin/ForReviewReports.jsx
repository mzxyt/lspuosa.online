import ModalComponent from "@/Components/ModalComponent";
import { statusColors } from "@/Components/SuperAdminDashboard";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState } from "react";
import { ReportImages } from "./ReportTableRow";
import { usePDF } from "react-to-pdf";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

export default function ForReviewReports({ reports, campuses }) {
  const [showExportPDF, setShowExportPDF] = useState(false);
  const { auth, appLogo } = usePage().props;
  const { toPDF, targetRef } = usePDF({ filename: "REPORT.pdf" });
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchedFor, setSearchedFor] = useState("");
  const [processing, setProcessing] = useState(false);

  const closeSearching = () => {
    setSearching(false);
    setSearchText("");
    setSearchResult([]);
    setSearchedFor("");
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.length > 0) {
      setSearching(true);
      setProcessing(true);
      axios
        .get(route("admin.reports.for-review.search", searchText))
        .then((res) => {
          setProcessing(false);
          console.log("search:", res);
          setSearchResult(res.data.reports);
          setSearchedFor(res.data.searchText);
        });
    }
  };

  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For review"
      defaultActiveLink="for review"
    >
      {auth.role === "super_admin" ? (
        <div className="px-10">
          <div className="content-wrapper mt-20 rounded-xl bg-white max-w-7xl mx-auto w-full">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-none">
                Choose a campus
              </h1>
              <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
                Click on the campus to view all of its reports.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {campuses.map((campus) => (
                <Link
                  key={campus.id}
                  href={route("admin.reports.for-review.campus", [
                    encodeURIComponent(campus.name),
                  ])}
                  className="w-full lg:flex-1 uppercase group hover:text-indigo-600 hover:border-indigo-300 rounded-md text-lg font-semibold text-slate-600 flex flex-col p-6 border-[1px] border-slate-300 shadow-sm"
                >
                  <i className="fi fi-rr-cabin text-3xl mb-3 text-slate-400 group-hover:text-indigo-400"></i>
                  <span>{campus.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
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
                      {reports.entries.map((entry, index) => (
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

          <div className="content-wrapper">
            <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl tracking-tight font-semibold mb-2 leading-none">
                    For reviewal reports
                  </h1>
                  <p className="leading-none text-slate-500 m-0">
                    Click on the campus to view all of its reports.
                  </p>
                </div>

                <div className="">
                  <button
                    onClick={() => setShowExportPDF(true)}
                    className="px-2.5 py-1 font-medium shadow-sm shadow-slate-400/10 border border-slate-200 rounded-md text-sm"
                  >
                    Export Data
                  </button>
                </div>
              </div>
              <Form onSubmit={onSearchSubmit} className="mt-4">
                <div className="flex">
                  <div className="relative flex-1">
                    <Form.Control
                      type="search"
                      required
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="rounded-lg !rounded-r-none placeholder:!text-slate-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 border-[1px] ps-5"
                      placeholder="Search"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[15px!important] flex items-center">
                      <i className="fi fi-rr-search leading-none text-secondary"></i>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 font-semibold text-sm rounded-r-lg bg-slate-200"
                  >
                    Find
                  </button>
                </div>
              </Form>

              {!searching ? (
                <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                        <th>Name</th>
                        <th>Date Submitted</th>
                        <th>Campus</th>
                        <th>Office</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reports.reports.map((report) => (
                        // check if the report is already archived then dont show
                        <>
                          {report.is_archived == 0 ? (
                            <tr
                              key={report.id}
                              className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                            >
                              <td>
                                {report.unit_head.firstname}{" "}
                                {report.unit_head.lastname}
                              </td>
                              <td>
                                {dayjs(report.created_at).format(
                                  "MMM. D, YYYY"
                                )}
                              </td>
                              <td>{report.unit_head.campus.name}</td>
                              <td>{report.unit_head.designation.name}</td>
                              <td>
                                <div
                                  className={`inline-block mr-2 w-2 h-2 rounded-full ${
                                    statusColors[report.status]
                                  }`}
                                ></div>
                                {report.status}
                              </td>
                              <td className="flex flex-col">
                                <Link
                                  href={route("admin.report.open", report.id)}
                                  className="hover:underline"
                                >
                                  View Reports
                                </Link>
                                {report.status == "Approved" ? (
                                  <Link
                                    onClick={() => {
                                      axios
                                        .put(
                                          route(
                                            "admin.report.archive",
                                            report.id
                                          )
                                        )
                                        .then((res) => {
                                          console.log("archive:", res);
                                          // if (res.status === 200) {
                                          //   // remove from list
                                          //   //  reload
                                          //   window.location.reload();
                                          // }
                                        });
                                    }}
                                    className="hover:underline mt-2"
                                  >
                                    Archive
                                  </Link>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ) : null}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <>
                  <Button
                    onClick={closeSearching}
                    disabled={processing}
                    variant="outline-success"
                    className="mt-4 rounded-pill mb-3 text-sm"
                    type="button"
                  >
                    {!processing ? (
                      <>
                        <span className="text-sm">
                          Search Result: {searchedFor}
                        </span>
                        <i className="bx bx-x"></i>
                      </>
                    ) : (
                      <span className="text-sm">Searching...</span>
                    )}
                  </Button>

                  {searchResult.length ? (
                    <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                            <th>Name</th>
                            <th>Date Submitted</th>
                            <th>Campus</th>
                            <th>Office</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {searchResult &&
                            searchResult.map((report) => (
                              <tr
                                key={report.id}
                                className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                              >
                                <td>
                                  {report.unit_head.firstname}{" "}
                                  {report.unit_head.lastname}
                                </td>
                                <td>
                                  {dayjs(report.created_at).format(
                                    "MMM. D, YYYY"
                                  )}
                                </td>
                                <td>{report.unit_head.campus.name}</td>
                                <td>{report.unit_head.designation.name}</td>
                                <td>
                                  <div
                                    className={`inline-block mr-2 w-2 h-2 rounded-full ${
                                      statusColors[report.status]
                                    }`}
                                  ></div>
                                  {report.status}
                                </td>
                                <td>
                                  <Link
                                    href={route("admin.report.open", report.id)}
                                    className="hover:underline"
                                  >
                                    View Reports
                                  </Link>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center">Nothing found.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </PanelLayout>
  );
}
