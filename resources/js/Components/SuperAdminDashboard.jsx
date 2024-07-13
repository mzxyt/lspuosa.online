import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import DashboardCard from "./DashboardCard";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import CalendarCard from "./CalendarCard";
import AnnouncementsCard from "./AnnouncementsCard";
import dayjs from "dayjs";
import { Link } from "@inertiajs/react";
import Chart from "./Chart";

export const statusColors = {
  Approved: "bg-emerald-600",
  Resubmitted: "bg-blue-600",
  Rejected: "bg-rose-600",
  Pending: "bg-amber-600",
};

const SuperAdminDashboard = () => {
  const [campuses, setCampuses] = useState([]);
  const [fetchingCampus, setFetchingCampus] = useState(true);
  const [latestTarget, setLatestTarget] = useState({
    loading: true,
    data: null,
  });

  const [newUsers, setNewUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [leftUsers, setLeftUsers] = useState(0);
  const [dueUsers, setDueUsers] = useState(0);
  const [overdueUsers, setOverdueUsers] = useState(0);
  const [submittedUsers, setSubmittedUsers] = useState(0);

  useEffect(() => {
    const fetchCampuses = () => {
      setFetchingCampus(true);
      axios.get(route("campus.index")).then((res) => {
        setCampuses(res.data.campuses);
        setFetchingCampus(false);
      });
    };

    const fetchLatestTarget = () => {
      axios.get(route("objectives.latest")).then((res) => {
        console.log("datasss", res.data);
        setLatestTarget({ loading: false, data: res.data.latestTarget });
      });
    };

    const fetchNewUsers = () => {
      axios.get(route("users.new.count")).then((res) => {
        console.log("new users", res.data);
        setNewUsers(res.data.newUsersCount);
      });
    };

    const fetchTotalUsers = () => {
      axios.get(route("users.total.count")).then((res) => {
        console.log("total users", res.data);
        setTotalUsers(res.data.totalUsersCount);
      });
    };

    const fetchLeftUsers = () => {
      axios.get(route("users.left.count")).then((res) => {
        console.log("left users", res.data);
        setLeftUsers(res.data.leftUsersCount);
      });
    };

    const fetchNearDueUsers = () => {
      axios.get(route("users.due.count")).then((res) => {
        console.log("near due users", res.data);
        setDueUsers(res.data.dueUsersCount);
      });
    };

    const fetchOverdueUsers = () => {
      axios.get(route("users.overdue.count")).then((res) => {
        console.log("overdue users", res.data);
        setOverdueUsers(res.data.overdueUsersCount);
      });
    };

    const fetchSubmittedUsers = () => {
      axios.get(route("users.submitted.count")).then((res) => {
        console.log("submitted users", res.data);
        setSubmittedUsers(res.data.submittedUsersCount);
      });
    };

    fetchCampuses();
    fetchLatestTarget();
    fetchNewUsers();
    fetchTotalUsers();
    fetchLeftUsers();
    fetchNearDueUsers();
    fetchOverdueUsers();
    fetchSubmittedUsers();
  }, []);

  console.log("PATEN KUNE", latestTarget);

  return (
    <div>
      <Row className="gx-2 gy-3">
        <Col>
          <Row className="px-2.5">
            <Chart />
          </Row>
          <Row className="px-2.5">
            <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white mb-8">
              <h1 className="text-xl font-bold mb-2 leading-none">
                Latest targets
              </h1>
              <p className="leading-none mb-4 text-slate-500 text-sm">
                See details about the user and status of the latest submitted
                report.
              </p>
              <div
                className={`overflow-hidden rounded-md border-slate-200 ${
                  !latestTarget.data ? "border-2 border-dashed" : "border"
                }`}
              >
                {latestTarget.loading ? (
                  <div className="py-6 text-center">Loading... Please wait</div>
                ) : latestTarget.data != null ? (
                  <table className="w-full">
                    <thead className="">
                      <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                        <th>Name</th>
                        <th>Office</th>
                        <th>Date</th>
                        <th>Campus</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {latestTarget.data.map((item, idx) => (
                        <tr
                          key={idx}
                          className="[&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                        >
                          <td>
                            {item.user.lastname}, {item.user.firstname}{" "}
                            {item.user.middlename}
                          </td>
                          <td>{item.user.designation.name}</td>
                          <td>
                            {dayjs(item.objective.due_date).format(
                              "MMM. D, YYYY"
                            )}
                          </td>
                          <td>{item.user.campus.name}</td>
                          <td className="flex items-center">
                            {item.objective.entries.length === 0
                              ? item.is_completed
                                ? "Completed"
                                : "In Progress"
                              : // check if all entries are completed
                              item.objective.entries.every(
                                  (entry) => entry.status == 1
                                )
                              ? "Completed"
                              : "In Progress"}
                          </td>
                          {/*
                           */}
                          {/* </tr> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-slate-500 text-sm py-6 text-center">
                    No reports submitted yet.
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                {latestTarget.loading ? (
                  ""
                ) : latestTarget.data != null ? (
                  <Link
                    className="px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-200 w-max text-sm font-semibold text-indigo-500 mt-4 block"
                    href={route("admin.user_objectives")}
                  >
                    View full
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Row>
          <Row className="gy-3 gx-3">
            {fetchingCampus ? (
              <>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
                <Col lg={6} md={6} xs={6}>
                  {/* submission bins */}
                  <DashboardCard
                    label="Unit Heads"
                    subLabel="..."
                    value="..."
                    variant="success"
                    icon={<i className="fi fi-rr-user fs-5"></i>}
                  />
                </Col>
              </>
            ) : (
              <>
                {campuses.map((campus, index) => (
                  <Col key={index} lg={6} md={6} xs={6}>
                    {/* submission bins */}
                    <DashboardCard
                      label="Unit Heads"
                      subLabel={campus.name}
                      value={campus.unit_heads?.length ?? 0}
                      variant="success"
                      key={index}
                      icon={<i className="fi fi-rr-user fs-5"></i>}
                    />
                  </Col>
                ))}
                <Col lg={6} md={6} xs={6}>
                  <Card className={`dashboard-card shadow-sm`}>
                    <Card.Body className="p-4 flex justify-between">
                      <div className="">
                        <div
                          className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-emerald-600 text-white to-emerald-400 text-center mb-3`}
                        >
                          {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                          <i className="fi fi-rr-user fs-5"></i>
                        </div>
                        <p className="mt-0 mb-0 text-sm fw-bold text-slate-800 fs-6">
                          Total Users
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`my-0 fw-bold text-dark text-[2.5rem]`}>
                          {totalUsers}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6} md={6} xs={6}>
                  <Card className={`dashboard-card shadow-sm`}>
                    <Card.Body className="p-4 flex justify-between">
                      <div className="">
                        <div
                          className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-emerald-600 text-white to-emerald-400 text-center mb-3`}
                        >
                          {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                          <i className="fi fi-rr-user fs-5"></i>
                        </div>
                        <p className="mt-0 mb-0 text-sm fw-bold text-slate-800 fs-6">
                          New Users
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`my-0 fw-bold text-dark text-[2.5rem]`}>
                          {newUsers}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6} md={6} xs={6}>
                  <Card className={`dashboard-card shadow-sm`}>
                    <Card.Body className="p-4 flex justify-between">
                      <div className="">
                        <div
                          className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-emerald-600 text-white to-emerald-400 text-center mb-3`}
                        >
                          {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                          <i class="fi fi-rr-exit fs-5"></i>{" "}
                        </div>
                        <p className="mt-0 mb-0 text-sm fw-bold text-slate-800 fs-6">
                          Left Users
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`my-0 fw-bold text-dark text-[2.5rem]`}>
                          {leftUsers}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6} md={6} xs={6}>
                  <Card
                    className={`dashboard-card shadow-sm border-l-[5rem] border-l-black`}
                  >
                    <Card.Body className="p-4 border-emerald-500 rounded-sm border-l-4 flex justify-between">
                      <div className="">
                        <div
                          className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-emerald-600 text-white to-emerald-400 text-center mb-3`}
                        >
                          {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                          <i class="fi fi-rr-memo-circle-check fs-5"></i>{" "}
                        </div>
                        <p className="mt-0 mb-0 text-sm fw-bold text-slate-800 fs-6">
                          Submitted Users
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`my-0 fw-bold text-dark text-[2.5rem]`}>
                          {submittedUsers}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6} md={6} xs={6}>
                  <Card
                    className={`dashboard-card shadow-sm border-l-[5rem] border-l-black`}
                  >
                    <Card.Body className="p-4 border-yellow-500 rounded-sm border-l-4 flex justify-between">
                      <div className="">
                        <div
                          className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-yellow-600 text-white to-yellow-400 text-center mb-3`}
                        >
                          {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                          <i class="fi fi-rr-calendar-clock"></i>
                        </div>
                        <p className="mt-0 mb-0 text-sm fw-bold text-slate-800 fs-6">
                          Near Due Users
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`my-0 fw-bol text-dark text-[2.5rem]`}>
                          {dueUsers}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6} md={6} xs={6}>
                  <Card
                    className={`dashboard-card shadow-sm border-l-[5rem] border-l-black`}
                  >
                    <Card.Body className="p-4 border-red-500 rounded-sm border-l-4 flex justify-between">
                      <div className="">
                        <div
                          className={`icon p-2 flex items-center justify-center w-[45px] h-[45px] rounded-2 fs-4 bg-gradient-to-tr from-red-600 text-white to-red-400 text-center mb-3`}
                        >
                          {/* <i className="fi fi-rr-boxes leading-none"></i>  */}
                          <i class="fi fi-rr-calendar-xmark"></i>{" "}
                        </div>
                        <p className="mt-0 mb-0 text-sm fw-bold text-slate-800 fs-6">
                          Overdue Users
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`my-0 fw-bold text-dark text-[2.5rem]`}>
                          {overdueUsers}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
          </Row>
          <CalendarCard viewButton className="mt-8" />
        </Col>
        <Col lg={3}>
          {/* <AnnouncementsCard link={route("admin.announcements")} /> */}

          {/* to be implemented :  */}
          {/* <Card className='border-0 p-3 shadow-sm'>
                        <Card.Body>
                            <p className='fs-6 fw-bold text-sm text-black-50'>Announcements</p>
                            {
                                announcements.map((item, index) => (
                                    <div className="mb-3" key={index}>
                                        <p>{item.title}</p>
                                    </div>
                                ))
                            }
                        </Card.Body>
                    </Card> */}
        </Col>
      </Row>
    </div>
  );
};

export default SuperAdminDashboard;
