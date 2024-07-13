import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CreateObjectives() {
  const [objectives, setObjectives] = useState([]);

  // fetch all objectives
  const fetchObjectives = () => {
    axios
      .get(route("objectives.all"))
      .then((res) => {
        console.log("test", res.data);
        setObjectives(res.data);
      })
      .catch((error) => console.log("error getting objectives ", error));
  };

  const columns = [
    {
      name: "Target",
      cell: (row) => <span>{row.title}</span>,
    },
    {
      name: "Target Type",
      // if 0 -> self check, if 1 -> submission use ternary operator it must check if the objective_type is 0 or 1 because there is also a possibility of 2 -> system event
      cell: (row) => (
        <span>{row.objective_type === 0 ? "Self Check" : "Submission"}</span>
      ),
    },
    {
      name: "Submission Bin",
      cell: (row) => <span>{row.submission_bin?.title}</span>,
    },
    {
      name: "Designation",
      cell: (row) => <span>{row.designation.name}</span>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <a
            href={`/admin/objectives/${row.id}/edit`}
            className="transition bg-yellow-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
          >
            Edit
          </a>
          <button
            onClick={() => {
              // delete objective
              setObjectives(objectives.filter((data) => data.id !== row.id));
              axios
                .delete(route("admin.objectives.delete", row.id))
                .then(() => {
                  toast.success("Objective successfully deleted.");
                  setObjectives(
                    objectives.filter((data) => data.id !== row.id)
                  );
                });
            }}
            className="transition bg-red-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-red-400 rounded-md ml-2"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

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

  useEffect(() => {
    fetchObjectives();
  }, []);

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="Create Targets"
    >
      <div className="content-wrapper">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Targets
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Submission Bin
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white mt-3 p-6">
                <div className="flex bg-white flex-col">
                  <h1 className="text-xl font-bold mb-2 leading-none">
                    Create Target
                  </h1>
                  <p className=" leading-none text-slate-500">
                    Generate a target for users to complete.s
                  </p>

                  <div className="flex mb-3 items-center gap-3">
                    <button
                      // onClick={() => handleSubmission()}
                      onClick={() =>
                        (window.location.href = route(
                          "admin.objectives.create"
                        ))
                      }
                      className=" w-max transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md flex"
                    >
                      <i className="fi fi-rs-add-document text-base mr-2"></i>
                      <span>Create Target</span>
                    </button>

                    <Link
                      className="px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-200 w-max text-sm font-semibold text-indigo-500 block"
                      // href={route("admin.report.open", latestTarget.data.id)}
                      href={route("admin.user_objectives")}
                    >
                      View monitoring
                    </Link>
                  </div>
                </div>

                <hr className="my-8 border-slate-400" />

                <h1 className="mt-4 text-xl font-bold mb-2 leading-none">
                  All targets
                </h1>
                <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
                  Check out all the created targets
                </p>

                <div className="mt-4  rounded-md overflow-hidden">
                  <DataTable
                    columns={columns}
                    pagination
                    data={objectives}
                    customStyles={customStyles}
                  />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>Content 2</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </PanelLayout>
  );
}

export default CreateObjectives;
