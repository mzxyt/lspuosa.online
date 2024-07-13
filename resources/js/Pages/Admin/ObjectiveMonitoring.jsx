import React, { useState, useEffect } from "react";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/app.css";
import ModalComponent from "@/Components/ModalComponent";
import { Input } from "postcss";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { Button, Textarea } from "flowbite-react";

const ObjectiveMonitoring = ({ classifications }) => {
  const [state, setState] = useState({
    selectedYear: null,
    selectedQuarter: null,
    selectedCampus: null,
    selectedStatus: null,
    classificationIndex: null,
    userObjectives: [],
    campuses: [],
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      const response = await axios.get(route("campus.index"));
      setState((prev) => ({ ...prev, campuses: response.data.campuses }));
    };
    fetchCampuses();
  }, []);

  useEffect(() => {
    const getUserObjectives = async () => {
      const response = await axios.get(
        route("objectives.user.get", {
          year: state.selectedYear ? state.selectedYear.getFullYear() : null,
          quarter: state.selectedQuarter,
          classificationIndex: state.classificationIndex,
          campus: state.selectedCampus,
        })
      );
      setState((prev) => ({ ...prev, userObjectives: response.data }));
    };
    getUserObjectives();
  }, [
    state.selectedYear,
    state.selectedQuarter,
    state.classificationIndex,
    state.selectedCampus,
  ]);

  const [showTargetsModal, setShowTargetsModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");

  const viewCommentModal = (objective) => {
    setSelectedObjective(objective);
    setComment("");
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setSelectedObjective(null);
    setComment("");
    setShowCommentModal(false);
  };

  const viewTargets = (objective) => {
    setSelectedObjective(objective);
    setShowTargetsModal(true);
  };

  const closeTargetsModal = () => {
    setSelectedObjective(null);
    setShowTargetsModal(false);
  };

  const handleYearChange = (date) => {
    setState((prev) => ({ ...prev, selectedYear: date }));
  };

  const handleQuarterChange = (e) => {
    setState((prev) => ({ ...prev, selectedQuarter: e.target.value }));
  };

  const handleCampusChange = (e) => {
    setState((prev) => ({ ...prev, selectedCampus: e.target.value }));
  };

  const handleClassificationChange = (e) => {
    setState((prev) => ({
      ...prev,
      classificationIndex: parseInt(e.target.value),
    }));
  };

  const ExpandedComponent = ({ object }) => (
    <pre>{JSON.stringify(object, null, 2)}</pre>
  );

  const columns = [
    {
      name: "Activities / Programme",
      sortable: true,
      selector: (row) => row.objective.title,
      width: "14rem",
      cell: (row) => <span>{row.objective.title}</span>,
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
      width: "10rem ",
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
      name: "Office",
      width: "auto",
      selector: (row) => row.user.designation.name,
      sortable: true,
      cell: (row) => <>{row.user.designation.name}</>,
    },
    // {
    //   name: "Objective Title",
    //   cell: (row) => <>{row.objective.title}</>,
    // },

    // objective status
    {
      name: "Status",
      width: "auto",
      selector: (row) => row.status,
      sortable: true,
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
      sortable: true,
      selector: (row) => row.objective.due_date,
      width: "auto",
      cell: (row) => (
        <>{new Date(row.objective.due_date).toLocaleDateString("en-US")}</>
      ),
    },

    // completed_at
    {
      name: "Completed At",
      selector: (row) => row.updated_at,
      sortable: true,
      width: "auto",
      cell: (row) => (
        <>
          {row.updated_at != row.created_at
            ? new Date(row.updated_at).toLocaleDateString("en-US")
            : "N/A"}
        </>
      ),
    },
    // action : approve, reject
    {
      name: "Action",
      width: "auto",
      cell: (row) => (
        // check if admin_status is 1 or 2
        <div className="flex flex-col">
          <div>{console.log(row)}</div>
          {row.admin_status == 0 ? (
            <div className="flex flex-col">
              {/*  */}

              {row.is_completed ? (
                // for reviewal, approve
                <div className="flex flex-col">
                  <button
                    variant="success"
                    className="bg-green-500 text-white px-2 py-1 rounded-md"
                    onClick={() => {
                      // approve objective
                      axios
                        .put(route("objectives.approve"), {
                          id: row.id,
                        })
                        .then((res) => {
                          if (res.statusText === "OK") {
                            setState((prev) => ({
                              ...prev,
                              userObjectives: state.userObjectives.map(
                                (objective) => {
                                  if (objective.id === row.id) {
                                    return {
                                      ...objective,
                                      admin_status: 1,
                                    };
                                  }
                                  return objective;
                                }
                              ),
                            }));
                          }
                        });
                    }}
                  >
                    Approve
                  </button>
                  {/* for reviewal */}
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2"
                    onClick={() => viewCommentModal(row)}
                  >
                    Return
                  </button>
                </div>
              ) : (
                // waiting
                <span className="text-gray-400">Waiting</span>
              )}
            </div>
          ) : row.admin_status == 1 ? (
            // display approved
            <span className="text-green-500">Approved</span>
          ) : (
            // display rejected
            <span className="text-red-500">For Review</span>
          )}

          {/* * check if there are entries, if there is show a button to check the entries
          {row.entries.length > 0 && (
            <button
            onClick={() =>
                router.visit(`/admin/objectives/${row.id}/entries`)
              }
              className="bg-blue-500 py-1 px-2 rounded-md text-white mt-2"
              >
              View Entries
              </button>
            )} */}
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
    <PanelLayout headerTitle="Targets Review">
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

      <ModalComponent
        centered
        size="lg"
        show={showCommentModal}
        handleClose={closeCommentModal}
      >
        {console.log(selectedObjective)}
        {selectedObjective && (
          <div className="my-2 container flex flex-col">
            {/* h1 title Add Comment */}
            <h2>Add Comment</h2>
            {/* send a comment why it is rejected */}
            <p>Send a comment why it is rejected</p>
            {/* input for comment */}
            <InputLabel htmlFor="comment" value="Comment" />
            <Textarea
              label="Comment"
              value={comment}
              className="h-[10rem] mb-3 text-black"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <Button
              className="border-solid border-2 rounded-xl  leading-[0.6rem] bg-blue text-white"
              onClick={() => {
                {
                  // reject objective
                  axios
                    .put(route("objectives.reject"), {
                      id: selectedObjective.id,
                      comment: comment,
                    })
                    .then((res) => {
                      if (res.statusText === "OK") {
                        // dynamically update the user objectives
                        setState((prev) => ({
                          ...prev,
                          userObjectives: state.userObjectives.map(
                            (objective) => {
                              if (objective.id === row.id) {
                                return {
                                  ...objective,
                                  admin_status: 2,
                                };
                              }
                              return objective;
                            }
                          ),
                        }));
                      }
                    });
                  closeCommentModal();
                }
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </ModalComponent>
      <div className="content-wrapper">
        {/* y ear date selector */}

        <div className="flex-col lg:flex-row flex-wrap flex lg:items-end">
          <div className="mx-2">
            <div>
              <p className="font-bold mb-0">Select Year</p>
            </div>
            <DatePicker
              selected={state.selectedYear}
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
              value={state.selectedQuarter}
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
              onChange={handleCampusChange}
              id="campus"
            >
              <option>Select Campus</option>
              {state.campuses.map((campus) => (
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
              onChange={handleClassificationChange}
            >
              <option value={""} disabled>
                All Offices
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

          <div className="w-full m-2">
            <Link
              className="bg-white px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-200 w-max text-sm font-semibold text-indigo-500 block"
              // href={route("admin.report.open", latestTarget.data.id)}
              href={route("admin.user_objectives.archives")}
            >
              View archives
            </Link>
          </div>
        </div>

        <div className="mt-4 z-10 border p-2 bg-white border-slate-200 rounded-md table-container">
          <h3 className="text-lg ml-2 mt-2 font-semibold">Objectives</h3>
          <div className="table-scroll overflow-auto">
            <DataTable
              columns={columns}
              data={state.userObjectives}
              pagination
              className="w-full"
              customStyles={customStyles}
              scrollX={true}
              scrollY={true}
              paginationRowsPerPageOptions={[1, 5, 100, 300, 500, 800, 1000]}
            />
          </div>
        </div>
      </div>
    </PanelLayout>
  );
};

export default ObjectiveMonitoring;
