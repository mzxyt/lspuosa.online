import ModalComponent from "@/Components/ModalComponent";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import { set } from "date-fns";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ObjectiveMonitoringArchive = ({ classifications }) => {
  console.log(classifications);
  const [classificationIndex, setClassificationIndex] = useState(null);
  // get all user objectives
  const [userObjectives, setUserObjectives] = useState([]);
  // year date selector
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  // get all campus
  const [campuses, setCampuses] = useState([]);

  // quarter
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const [selectedCampus, setSelectedCampus] = useState(null);

  const handleQuarterChange = (e) => {
    setSelectedQuarter(e.target.value);
  };

  const [showTargetsModal, setShowTargetsModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);

  const viewTargets = (objective) => {
    setSelectedObjective(objective);
    setShowTargetsModal(true);
  };

  const closeTargetsModal = () => {
    setSelectedObjective(null);
    setShowTargetsModal(false);
  };

  useEffect(() => {
    const getUserObjectives = async () => {
      await axios
        .get(
          route("objectives.user.archive.get", {
            year: selectedYear ? selectedYear.getFullYear() : null,
            quarter: selectedQuarter,
            classificationIndex: classificationIndex,
            campus: selectedCampus,
          })
        )
        .then((res) => {
          if (res.status === 200) {
            setUserObjectives(res.data);
          }
        });
    };

    getUserObjectives();
  }, [selectedYear, selectedQuarter, classificationIndex, selectedCampus]);

  useEffect(() => {
    const fetchCampuses = () => {
      axios.get(route("campus.index")).then((res) => {
        setCampuses(res.data.campuses);
      });
    };

    fetchCampuses();
  }, []);

  // user name ( first name + last name ), campus, designation, objective title, objective status ( is_completed ), objective type
  const columns = [
    {
      name: "Activities / Programme",
      cell: (row) => (
        <span>
          {row.entries.length === 0
            ? row.objective.title
            : row.entries.map((entry, index) => {
                console.log(entry);
                // Return the JSX for each entry here
                return (
                  <div key={index}>
                    {/* Example: Display entry description */}
                    <p>
                      {index + 1}.) {entry.objective_entry.description}
                    </p>
                  </div>
                );
              })}
        </span>
      ),
    },
    {
      name: "Targets",
      width: "13rem",
      cell: (row) => (
        <span>
          {row.entries.length === 0 ? (
            row.is_completed ? (
              "Completed"
            ) : (
              "In Progress"
            )
          ) : (
            <button
              className="text-blue-500 underline"
              onClick={() => viewTargets(row)}
            >
              View Targets
            </button>
          )}
        </span>
      ),
    },
    {
      name: "Actual Accomplished",
      width: "14rem",

      cell: (row) => (
        <div className="flex justify-center flex-col">
          {row.entries.map((entry, index) => {
            if (entry.info_data) {
              const data = JSON.parse(entry.info_data);
              return (
                <div
                  className="border-solid border-2 rounded-xl my-1  leading-[0.9rem] border-black p-2"
                  key={index}
                >
                  {Object.entries(data).map(([key, value]) => (
                    <p className="text-center text-[0.7rem]" key={key}>
                      {/* Display the dynamic key and its value */}
                      <span className="font-bold">
                        {" "}
                        {`${key
                          .replace(/([a-z])([A-Z])/g, "$1 $2")
                          .replace(/\b\w/g, (str) => str.toUpperCase())}`}
                      </span>
                      <br />
                      <span>{value}</span>
                    </p>
                  ))}
                </div>
              );
            }
          })}
        </div>
      ),
    },
    {
      name: "Documentation",
      width: "10rem",
      cell: (row) => (
        <div className="flex flex-col">
          {row.entries.map((entry, index) => {
            if (entry.file_path) {
              return (
                <div key={index} className="my-5">
                  <a
                    onClick={() => {
                      axios
                        .get(
                          route(
                            "objectives.documentation.download",
                            entry.file_path
                          ),
                          {
                            responseType: "blob",
                          }
                        )
                        .then((response) => {
                          const url = window.URL.createObjectURL(
                            new Blob([response.data])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `${entry.file_path}`);
                          document.body.appendChild(link);
                          link.click();
                          link.parentNode.removeChild(link);
                        })
                        .catch((error) => {
                          console.log("failed to download file", error);
                        });
                    }}
                    download
                    className="border-solid border-2 rounded-xl w-[80%] leading-[0.6rem] bg-blue text-white py-1 px-2"
                  >
                    Download
                  </a>
                </div>
              );
            }
          })}
        </div>
      ),
    },
    {
      name: "Designation",
      cell: (row) => <>{row.user.designation.name}</>,
    },
    // {
    //   name: "Objective Title",
    //   cell: (row) => <>{row.objective.title}</>,
    // },

    // objective status
    {
      name: "Status",
      cell: (row) => (
        //  1 - on time, 0 - ongoing, 2 - pass due
        <span>
          {row.status == 1
            ? "On Time"
            : row.status == 2
            ? "Pass Due"
            : "On Going"}
        </span>
      ),
    },
    {
      // due date
      name: "Due Date",
      cell: (row) => (
        <>{new Date(row.objective.due_date).toLocaleDateString("en-US")}</>
      ),
    },

    // completed_at
    {
      name: "Completed At",
      cell: (row) => (
        <>
          {row.updated_at != row.created_at
            ? new Date(row.updated_at).toLocaleDateString("en-US")
            : "N/A"}
        </>
      ),
    },
    // action : approve, reject
  ];

  const customStyles = {
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

  return (
    <PanelLayout headerTitle="Target Archives">
      <ModalComponent
        centered
        size="lg"
        show={showTargetsModal}
        handleClose={closeTargetsModal}
      >
        {selectedObjective && (
          <div className="my-2 container">
            <h2>Targets</h2>
            <ul>
              {selectedObjective.entries.map((target, index) => (
                <li key={index}>
                  {target.objective_entry.description} -{" "}
                  {target.status === 1 ? "Completed" : "In Progress"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </ModalComponent>
      <div className="content-wrapper">
        {/* y ear date selector */}

        <div className="flex">
          <div className="mx-2">
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

          {/* quarter dropdown option ( 1st quarter - jan-march, 2nd quarter - Apr-Jun, 3rd quarter - Jul-Sept, 4th - Oct-Dec) */}
          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Quarter</p>
            </div>
            <select
              className="border-slate-300 rounded-md hover:border-slate-400"
              name="quarter"
              id="quarter"
              value={selectedQuarter}
              onChange={handleQuarterChange}
            >
              <option>Select Quarter</option>
              <option value="1">1st Quarter</option>
              <option value="2">2nd Quarter</option>
              <option value="3">3rd Quarter</option>
              <option value="4">4th Quarter</option>
            </select>
          </div>

          {/* select campus */}
          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Campus</p>
            </div>
            <select
              className="border-slate-300 rounded-md hover:border-slate-400"
              name="campus"
              onChange={(e) => setSelectedCampus(e.target.value)}
              id="campus"
            >
              <option>Select Campus</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          <div className="z-50 mx-2">
            <div>
              <p className="font-bold mb-0">Select Classification</p>
            </div>
            <select
              required
              className="border-slate-300 w-[90%] rounded-md hover:border-slate-400"
              defaultValue={""}
              onChange={(e) => setClassificationIndex(parseInt(e.target.value))}
            >
              <option value={""} disabled>
                Select Classification
              </option>
              {classifications &&
                classifications.map((c, index) => (
                  <optgroup key={index + 1} label={c.name}>
                    {c.designations.map((desig, i) => (
                      <option value={desig.id} key={desig.id}>
                        {desig.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
          </div>
        </div>

        <div className="mt-4 z-10 border p-2 bg-white border-slate-200 rounded-md overflow-hidden">
          <h3 className="text-lg ml-2 mt-2 font-semibold">Objectives</h3>
          <DataTable
            columns={columns}
            data={userObjectives}
            pagination
            customStyles={customStyles}
            paginationRowsPerPageOptions={[1, 5, 100, 300, 500, 800, 1000]}
          />
        </div>
      </div>
    </PanelLayout>
  );
};

export default ObjectiveMonitoringArchive;
