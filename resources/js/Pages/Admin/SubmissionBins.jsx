import ConfirmModal from "@/Components/ConfirmModal";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Accordion,
  Button,
  Card,
  Container,
  Dropdown,
  Form,
  Placeholder,
  useAccordionButton,
} from "react-bootstrap";
import { toast } from "sonner";
import DataTable from "react-data-table-component";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SubmissionBins = ({ auth, submission_bins, rows, reports }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [id, setId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [submissionBins, setSubmissionBins] = useState([...submission_bins]);
  const [lastRowId, setLastRowId] = useState(
    submission_bins.length == 0
      ? 0
      : submission_bins[submission_bins.length - 1]?.id
  );
  const [fetching, setFetching] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchedFor, setSearchedFor] = useState("");
  const [hasRows, setHasRows] = useState(rows > 10);

  const fetchSubmissionBins = () => {
    setFetching(true);
    axios.get(route("submission-bins.index", lastRowId)).then((res) => {
      let bins = res.data.submissionBins;
      setLastRowId(bins[bins.length - 1].id);
      setTimeout(() => {
        setFetching(false);
        setSubmissionBins((prev) => [...prev, ...bins]);
        console.log("updated ", submissionBins);
        setHasRows(res.data.hasRows);
      }, 1500);
    });
  };

  const getReportsCount = (submission_bin_id) => {
    let count = 0;
    for (let report of reports) {
      if (report.submission_bin_id == submission_bin_id) {
        count++;
      }
    }

    return count;
  };

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <button
        className="col-12 bg-transparent cursor-pointer border-0 text-left py-[1.2rem] px-2"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  const deleteRow = (id) => {
    setId(id);
    setShowConfirmModal(true);
  };

  const onConfirmDelete = () => {
    setShowConfirmModal(false);
    if (id) {
      router.delete(route("submission_bins.delete", { id }), {
        preserveState: false,
      });
    }
  };

  const onCancel = () => {
    setShowConfirmModal(false);
    setId(null);
  };

  const closeSearching = () => {
    setSearching(false);
    setSearchText("");
    setSearchResult([]);
    setSearchedFor("");
  };

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

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.length > 0) {
      setSearching(true);
      setProcessing(true);
      axios.get(route("submission-bins.search", searchText)).then((res) => {
        setProcessing(false);
        console.log("search:", res);
        setSearchResult(res.data.submissionBins);
        setSearchedFor(res.data.searchText);
      });
    }
  };

  return (
    <PanelLayout
      userAuth={auth}
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="submission_bin"
      headerTitle="Submission Bins and Targets"
    >
      {id && (
        <ConfirmModal
          show={showConfirmModal}
          handleClose={onCancel}
          onCancel={onCancel}
          onConfirm={onConfirmDelete}
          title="Are you sure to delete submission bin?"
          message="Warning, this cannot be undone"
        />
      )}
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
            <Tab.Panel>
              <div className="bg-white p-4 mt-4 ">
                {auth.role === "super_admin" ? (
                  <>
                    <div className="flex justify-between  items-end  bg-white">
                      <div>
                        <h1 className="text-xl font-bold">Submission Bins</h1>
                        <p className="mb-4 text-secondary">
                          This is where you can create submission bins for the
                          accomplishment reports of unit heads.
                        </p>
                        <Link
                          href={route("admin.create_submission_bin")}
                          variant="primary"
                          className="bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md"
                        >
                          <i className="bx bx-plus"></i> Create
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm mt-3 text-secondary">
                      Submission bins for the accomplishment reports of unit
                      heads.
                    </p>
                  </>
                )}
                <hr className="my-6" />

                <div className="mb-3">
                  <Form onSubmit={onSearchSubmit}>
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
                      <button className="px-3 py-2 font-semibold text-sm rounded-r-lg bg-slate-200">
                        Find
                      </button>
                    </div>
                  </Form>
                </div>
                {!searching ? (
                  <Accordion defaultActiveKey="0">
                    {submissionBins &&
                      submissionBins.map((item, index) => (
                        <Card className="border-0 mb-1 shadow-sm" key={index}>
                          {console.log(item)}
                          <Card.Header className="bg-white">
                            <CustomToggle eventKey={index}>
                              <div className="row items-center ">
                                <div className="col">
                                  <div className="flex items-center gap-x-3 text-secondary">
                                    <i className="fi fi-rr-box fs-5"></i>
                                    <span className="fw-bold">
                                      {item.title}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-auto text-end">
                                  <div className="flex justify-end items-center gap-2">
                                    {item.deadline_date && (
                                      <p className="my-0 text-sm text-secondary">
                                        Due{" "}
                                        {format(
                                          new Date(item.deadline_date),
                                          "MMM dd, yyyy"
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CustomToggle>
                          </Card.Header>
                          <Accordion.Collapse className="meow" eventKey={index}>
                            <>
                              <Card.Body className="p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="mt-0 mb-3 text-sm text-secondary">
                                      <small>
                                        Created on{" "}
                                        {format(
                                          new Date(item.created_at),
                                          "MMM dd, yyyy"
                                        )}
                                      </small>
                                    </p>
                                    <p className="text-sm">
                                      {item.instruction || "No instruction."}
                                    </p>
                                  </div>
                                  {auth.role === "super_admin" && (
                                    <Dropdown>
                                      <Dropdown.Toggle
                                        bsPrefix="toggler"
                                        className=" btn-link bg-transparent text-decoration-none"
                                      >
                                        <i className=" fi fi-br-menu-dots-vertical"></i>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu align="end">
                                        <Dropdown.Item
                                          href={route(
                                            "admin.edit_submission_bin",
                                            {
                                              id: item.id,
                                            }
                                          )}
                                        >
                                          Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={() => deleteRow(item.id)}
                                        >
                                          Delete
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  )}
                                </div>
                                <div className="flex justify-end items-center gap-4">
                                  <div className="text-center">
                                    <p className="fs-3 fw-bold text-primary">
                                      {auth.role == "super_admin"
                                        ? item.approved_reports?.length ?? 0
                                        : getReportsCount(item.id)}
                                    </p>
                                    <p className="text-sm mb-0">Submitted</p>
                                  </div>
                                </div>
                              </Card.Body>
                              <Card.Footer className="bg-white py-3">
                                <div className="flex items-center justify-end">
                                  {/* <Link href={route('admin.submission_bin.details',{id:item.id})} className='rounded-1 text-sm btn btn-light'>
                                                        <small>View more details</small>
                                                    </Link> */}
                                  <Link
                                    as={"button"}
                                    href={route("admin.reports.view", {
                                      submission_bin_id: item.id,
                                    })}
                                    className="rounded-1 text-sm btn btn-primary"
                                  >
                                    <small>View Reports</small>
                                  </Link>
                                </div>
                              </Card.Footer>
                            </>
                          </Accordion.Collapse>
                        </Card>
                      ))}
                  </Accordion>
                ) : (
                  <>
                    <Button
                      onClick={closeSearching}
                      disabled={processing}
                      variant="outline-success"
                      className="rounded-pill mb-3 text-sm"
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
                    {searchResult.length > 0 ? (
                      <Accordion defaultActiveKey="0">
                        {searchResult &&
                          searchResult.map((item, index) => (
                            <Card
                              className="border-0 mb-1 shadow-sm"
                              key={index}
                            >
                              <Card.Header className="bg-white">
                                <CustomToggle eventKey={index}>
                                  <div className="row items-center ">
                                    <div className="col">
                                      <div className="flex items-center gap-x-3 text-secondary">
                                        <i className="fi fi-rr-box fs-5"></i>
                                        <span className="fw-bold">
                                          {item.title}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-auto text-end">
                                      <div className="flex justify-end items-center gap-2">
                                        {item.deadline_date && (
                                          <p className="my-0 text-sm text-secondary">
                                            Due{" "}
                                            {format(
                                              new Date(item.deadline_date),
                                              "MMM dd, yyyy"
                                            )}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CustomToggle>
                              </Card.Header>
                              <Accordion.Collapse eventKey={index}>
                                <>
                                  <Card.Body className="p-4">
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="mt-0 mb-3 text-sm text-secondary">
                                          <small>
                                            Created on{" "}
                                            {format(
                                              new Date(item.created_at),
                                              "MMM dd, yyyy"
                                            )}
                                          </small>
                                        </p>
                                        <p className="text-sm">
                                          {item.instruction ||
                                            "No instruction."}
                                        </p>
                                      </div>
                                      {auth.role === "super_admin" && (
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            bsPrefix="toggler"
                                            className=" btn-link bg-transparent text-decoration-none"
                                          >
                                            <i className=" fi fi-br-menu-dots-vertical"></i>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu align="end">
                                            <Dropdown.Item
                                              href={route(
                                                "admin.edit_submission_bin",
                                                {
                                                  id: item.id,
                                                }
                                              )}
                                            >
                                              Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() => deleteRow(item.id)}
                                            >
                                              Delete
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      )}
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                      <div className="text-center">
                                        <p className="fs-3 fw-bold text-primary">
                                          {item.reports?.length ?? 0}
                                        </p>
                                        <p className="text-sm mb-0">
                                          Submitted
                                        </p>
                                      </div>
                                    </div>
                                  </Card.Body>
                                  <Card.Footer className="bg-white py-3">
                                    <div className="flex items-center justify-end">
                                      {/* <Link href={route('admin.submission_bin.details',{id:item.id})} className='rounded-1 text-sm btn btn-light'>
                                                        <small>View more details</small>
                                                    </Link> */}
                                      <Link
                                        as={"button"}
                                        href={route("admin.reports.view", {
                                          submission_bin_id: item.id,
                                        })}
                                        className="rounded-1 text-sm btn btn-primary"
                                      >
                                        <small>View Reports</small>
                                      </Link>
                                    </div>
                                  </Card.Footer>
                                </>
                              </Accordion.Collapse>
                            </Card>
                          ))}
                      </Accordion>
                    ) : (
                      <p className="text-center">Nothing found.</p>
                    )}
                  </>
                )}
                {(!submission_bins || submission_bins.length == 0) && (
                  <p>No submission bin to show.</p>
                )}
                {fetching && (
                  <>
                    <Placeholder as="div" animation="wave" className="my-0 ">
                      <div className="col-12 bg-white shadow-sm h-[60px]">
                        <Container>
                          <Placeholder
                            as="p"
                            animation="wave"
                            className="my-0 "
                          >
                            <Placeholder xs={5} bg="light" />
                          </Placeholder>
                        </Container>
                      </div>
                    </Placeholder>
                  </>
                )}
                {!searching && hasRows && (
                  <div className="text-center my-2">
                    <Button
                      disabled={fetching}
                      variant="light"
                      className="text-primary fw-bold"
                      onClick={fetchSubmissionBins}
                    >
                      {fetching ? "Load more..." : "Load more"}
                    </Button>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </PanelLayout>
  );
};

export default SubmissionBins;
