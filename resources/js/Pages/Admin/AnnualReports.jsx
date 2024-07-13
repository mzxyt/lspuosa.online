import { useState, useEffect } from "react";
import axios from "axios";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import { set } from "date-fns";
import XLSX from "xlsx/dist/xlsx.full.min.js";

export default function AnnualReport({ auth }) {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [report, setReports] = useState({
    data: [],
    loading: true,
    check: false,
  });

  useEffect(() => {
    // axios
    //   .get(route("admin.annual_reports.index"))
    //   .then((response) => {
    //     const responseData = response.data || {};
    //     setReports({ data: responseData.reports || [], loading: false });
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching reports:", error);
    //     setReports({ data: [], loading: false });
    //   });

    if (report?.check === true) {
      setReports({ data: report.data, loading: false, check: false });
      console.log(report);
    }

    // get all campuses
    axios
      .get(route("campus.index"))
      .then((response) => {
        const responseData = response.data || {};
        console.log(responseData);
        setCampuses(responseData.campuses || []);
      })
      .catch((error) => {
        console.error("Error fetching campuses:", error);
      });
  }, [report]);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  const handleSubmission = async () => {
    // Check if selectedYear, selectedQuarter, and selectedCampus are not empty
    if (!selectedYear || !selectedQuarter || !selectedCampus) {
      toast.error("Please select a year, quarter, and campus.");
      return;
    }

    try {
      const response = await axios.get(route("admin.annual_reports.create"), {
        params: {
          year: selectedYear.getFullYear(),
          quarter: selectedQuarter,
          campus: selectedCampus,
        },
      });
      setReports({ data: response.data.data, loading: false, check: true });
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports(null); // Clear the report state on error
    }
  };

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

    // // Add data rows
    Object.entries(report.data).forEach(([location, data]) => {
      Object.entries(data.quarters).forEach(([quarter, quarterData]) => {
        console.log(quarterData.reports);
        // return;
        quarterData.reports.forEach((report) => {
          wsData.push([
            report.date_submitted.substr(0, 4), // Year
            report.quarter, // Quarter
            report.unit_head.firstname + " " + report.unit_head.lastname, // Unit Head
            report.unit_head.campus.name, // Campus
            report.unit_head.designation.classification.name, // Office
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

  const customStyles = {
    // rows: {
    //   style: {
    //     minHeight: "72px", // override the row height
    //   },
    // },
    headCells: {
      style: {
        padding: "10px 20px",
        fontSize: "14px",
        background: "#f8fafc",
        fontWeight: 700,
        color: "#475569",
      },
    },
    cells: {
      style: {
        padding: "10px 20px",
        fontSize: "14px",
      },
    },
  };

  const columns = [
    {
      name: "Year",
      selector: (row) => dayjs(row.date_submitted).format("YYYY"),
      sortable: true,
    },
    {
      name: "Quarter",
      selector: (row) => row.quarter,
      sortable: true,
    },
    {
      name: "Unit Head",
      selector: (row) => row.unit_head.firstname + " " + row.unit_head.lastname,
      sortable: true,
    },
    {
      name: "Campus",
      selector: (row) => row.unit_head.campus.name,
      sortable: true,
    },
    {
      name: "Office",
      selector: (row) => row.unit_head.designation.classification.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Timely Manner",
      selector: (row) => row.timely_matter,
      sortable: true,
    },
  ];

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated reports annually"
    >
      <div className="content-wrapper">
        <div className="bg-white p-6">
          <div className="flex bg-white flex-col">
            <h1 className="text-xl font-bold mb-2 leading-none">
              Generate annual report
            </h1>
            <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
              Generate a detailed report regarding the submitted reports for
              you.
            </p>
            <div className="flex">
              <div className="flex flex-col mr-2">
                <div>
                  <p className="font-bold mb-0">Select Year</p>
                </div>
                <DatePicker
                  selected={selectedYear}
                  onChange={handleYearChange}
                  dateFormat="yyyy"
                  showYearPicker
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                  customInput={
                    <input className="border-slate-300 rounded-md hover:border-slate-400  " />
                  }
                />
              </div>

              <div className="flex flex-col mx-2">
                <div>
                  <p className="font-bold mb-0">Select Quarter</p>
                </div>
                {/* option */}

                <select
                  className="border-slate-300 rounded-md hover:border-slate-400"
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                >
                  <option value="">Select Quarter</option>
                  <option value="1">Q1</option>
                  <option value="2">Q2</option>
                  <option value="3">Q3</option>
                  <option value="4">Q4</option>
                </select>
              </div>

              <div className="flex flex-col mx-2">
                <div>
                  <p className="font-bold mb-0">Select Campus</p>
                </div>
                {/* option */}

                <select
                  className="border-slate-300 rounded-md hover:border-slate-400"
                  onChange={(e) => setSelectedCampus(e.target.value)}
                >
                  <option value="">Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => handleSubmission()}
              className="mt-4 w-max transition bg-indigo-600 mb-3 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md flex"
            >
              <i className="fi fi-rs-add-document text-base mr-2"></i>
              <span>Generate</span>
            </button>
          </div>

          <hr className="my-8 border-slate-400" />

          <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
            {Object.entries(report.data).map(([quarter, quarterData]) => (
              <div className="flex flex-col" key={quarter}>
                <DataTable
                  columns={columns}
                  pagination
                  data={
                    Object.entries(quarterData.quarters)[0][1]?.reports || []
                  }
                  customStyles={customStyles}
                />
              </div>
            ))}
          </div>
          {report.data.length != 0 && (
            <button
              onClick={generateExcel}
              className="bg-green-600 mt-4 space-x-1 items-center flex text-white px-3 py-2 text-sm font-medium shadow hover:bg-green-400 rounded-md"
            >
              <i className="fi fi-rr-download mr-1"></i>{" "}
              <span className="tracking-wide">Generate Excel</span>
            </button>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
