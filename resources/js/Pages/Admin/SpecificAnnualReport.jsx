"use client";
import HeaderTitle from "@/Components/HeaderTitle";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { useRef } from "react";
import { Accordion } from "react-bootstrap";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import XLSX from "xlsx/dist/xlsx.full.min.js";

export default function AnnualReport({ report }) {
  console.log(report.data);
  const ref = useRef();
  const print = useReactToPrint({
    content: () => ref.current,
  });

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [
        "Year",
        "Quarter",
        "Unit Head",
        "Campus",
        "Office",
        "Status",
        "Timely Manner",
      ],
    ];

    // Add data rows
    Object.entries(report.data).forEach(([location, data]) => {
      Object.entries(data.quarters).forEach(([quarter, quarterData]) => {
        quarterData.reports.forEach((report) => {
          wsData.push([
            report.date_submitted.substr(0, 4), // Year
            quarter, // Quarter
            report.unit_head.firstname + " " + report.unit_head.lastname, // Unit Head
            location, // Campus
            report.unit_head.designation.name, // Office
            report.status, // Status
            report.timely_matter, // Timely Manner
          ]);
        });
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Annual Report");
    XLSX.writeFile(wb, "annual_report.xlsx");
  };

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      pageTitle="Annual report"
      headerTitle={
        <HeaderTitle
          text="Generated reports annually"
          backButton
          backButtonLink={route("admin.generated-reports")}
        />
      }
      defaultActiveLink="generated reports annually"
    >
      <div className="content-wrapper">
        <div className=" bg-white p-6">
          <div className="border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-2 leading-none">
                Annual report
              </h1>
              <p className="leading-none mb-0 text-slate-500">
                Check out the details regarding this annual report.
              </p>
            </div>

            {/* <button
              onClick={print}
              className="bg-indigo-600 space-x-1 items-center flex text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
            >
              <i className="fi fi-rr-print mr-1"></i>{" "}
              <span className="tracking-wide">Print annual report</span>
            </button> */}

            <button
              onClick={generateExcel}
              className="bg-green-600 space-x-1 items-center flex text-white px-3 py-2 text-sm font-medium shadow hover:bg-green-400 rounded-md"
            >
              <i className="fi fi-rr-download mr-1"></i>{" "}
              <span className="tracking-wide">Generate Excel</span>
            </button>
          </div>
          <div className="" ref={ref}>
            {Object.entries(report.data).map(([location, data], i) => (
              <div
                className="rounded-md overflow-hidden border mb-4 border-slate-200"
                key={location}
              >
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div>
                    <h4 className="mb-0 text-lg font-semibold">{location}</h4>
                    <p className="mb-0">
                      <span className="text-slate-600 inline-block px-2 bg-slate-100 border border-slate-200 rounded-md text-2xl">
                        <b>{data.total}</b>
                      </span>{" "}
                      total overall reports{" "}
                      <span className="font-semibold text-slate-600">
                        from all offices in all quarters
                      </span>
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  {Object.entries(data.quarters).length ? (
                    Object.entries(data.quarters).map(
                      ([quarter, quarterData]) => (
                        <div key={quarter}>
                          <p className="mb-2 mt-4 font-bold">
                            {quarter.replace("Q", "")}
                            {quarter.replace("Q", "") == 1
                              ? "st"
                              : quarter.replace("Q", "") == 2
                              ? "nd"
                              : "rd"}{" "}
                            Quarter
                          </p>
                          <p className="mt-0">
                            <span className="text-slate-600 inline-block px-2 bg-slate-100 border border-slate-200 rounded-md text-lg">
                              <b>{quarterData.total}</b>
                            </span>{" "}
                            total reports{" "}
                            <span className="font-semibold text-slate-600">
                              this quarter
                            </span>
                          </p>
                          <div className="border border-slate-200 rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-4 [&>th]:py-2 border-b [&>th]:text-sm [&>th]:font-medium">
                                  <th>Office</th>
                                  <th>Number of Reports</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(quarterData.offices).map(
                                  ([office, officeData]) => (
                                    <tr
                                      key={office}
                                      className="border-b last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-4 [&>td]:py-2.5"
                                    >
                                      <td>{office}</td>
                                      <td>{officeData}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      No report
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
