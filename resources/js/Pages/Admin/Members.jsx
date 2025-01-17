import PanelLayout from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";
import { set } from "date-fns";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

const Members = () => {
  const [usersLeft, setUsersLeft] = useState([]);
  const [usersNew, setUsersNew] = useState([]);

  useEffect(() => {
    const getLeftUsers = async () => {
      await axios.get(route("users.left")).then((res) => {
        if (res.statusText === "OK") {
          console.log(res.data.leftUsers);
          setUsersLeft(res.data.leftUsers);
        }
      });
    };

    const getNewUsers = async () => {
      await axios.get(route("users.new")).then((res) => {
        if (res.statusText === "OK") {
          console.log(res.data.newUsers);
          setUsersNew(res.data.newUsers);
        }
      });
    };

    getLeftUsers();
    getNewUsers();
  }, []);

  //   const columns = [
  //     {
  //       name: "Report Year",
  //       cell: (row) => (
  //         <span>
  //           {new Date(row.created_at).toLocaleDateString("en-US", {
  //             year: "numeric",
  //           })}
  //         </span>
  //       ),
  //     },
  //     {
  //       name: "Generated By",
  //       cell: (row) => <>{row.generated_by}</>,
  //     },
  //     {
  //       name: "Generated At",
  //       cell: (row) => (
  //         <>
  //           <span>{dayjs(row.generated_at).format("MMM d, YYYY")}</span>
  //         </>
  //       ),
  //     },
  //   ];

  //   user name, campus, designation, date
  const columns = [
    {
      name: "User",
      cell: (row) => (
        <>
          {row.firstname} {row.lastname}
        </>
      ),
    },
    {
      name: "Campus",
      cell: (row) => <>{row.campus.name}</>,
    },
    {
      name: "Designation",
      cell: (row) => <>{row.designation.name}</>,
    },
    {
      name: "Date",
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleDateString("en-US")}</span>
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

  return (
    <PanelLayout headerTitle="Members">
      <div className="content-wrapper">
        <div className="mt-4 border p-2 bg-white border-slate-200 rounded-md overflow-hidden">
          <h3 className="text-lg ml-2 mt-2 font-semibold">Left Users</h3>
          <DataTable
            columns={columns}
            data={usersLeft}
            pagination
            customStyles={customStyles}
          />
        </div>

        <div className="mt-4 border p-2 bg-white border-slate-200 rounded-md overflow-hidden">
          <h3 className="text-lg ml-2 mt-2 font-semibold">New Users</h3>
          <DataTable
            columns={columns}
            data={usersNew}
            pagination
            customStyles={customStyles}
          />
        </div>
      </div>
    </PanelLayout>
  );
};

export default Members;
