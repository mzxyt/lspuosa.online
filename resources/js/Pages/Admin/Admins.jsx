import CardComponent from "@/Components/CardComponent";
import TextProfilePic from "@/Components/TextProfilePic";
import PanelLayout from "@/Layouts/PanelLayout";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Image,
  Nav,
  Spinner,
  Table,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { MultipartHeader } from "@/constants/constants";

const Admins = ({ campus_admins }) => {
  const [rows, setRows] = useState([...campus_admins]);
  const [fetching, setFetching] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  const fetchAllAdmins = () => {
    if (!fetching) {
      setFetching(true);
      axios.get(route("admins")).then((res) => {
        console.log(res);
        setRows(res.data.admins);
        setFetching(false);
      });
    }
  };

  const columns = [
    {
      name: "Campus Admin",
      selector: (row) => row.firstname,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div>
            {row.image ? (
              <Image
                src={row.image}
                fluid
                roundedCircle
                width={35}
                height={35}
              />
            ) : (
              <TextProfilePic
                size="sm"
                text={`${row.firstname[0]}`}
                bg="primary"
                className=" text-light fw-bold"
              />
            )}
          </div>
          <div>
            {row.firstname} {row.lastname}
          </div>
        </div>
      ),
    },
    {
      name: "Email",
      sortable: true,
      selector: (row) => row.email,
    },
    {
      name: "Campus",
      sortable: true,
      selector: (row) => (row.campus ? row.campus.name : "Not set"),
    },
    {
      name: "",
      button: true,
      cell: (row) => (
        <Link
          href={route("admin.campus_admin.edit", { id: row.id })}
          className="fs-5 link-success nav-link"
        >
          <i className="fi fi-rr-pen-square"></i>
        </Link>
      ),
      grow: 0,
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

  const deleteBtnClicked = () => {
    Swal.fire({
      title: "Are you sure to delete this admin?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRows();
      }
    });
  };
  const deleteRows = () => {
    var formData = new FormData();
    for (let row of selectedRows) {
      formData.append("id[]", row.id);
      axios
        .post(route("admins.delete.many"), formData, MultipartHeader)
        .then((res) => {
          toast.success("Successfully deleted!");
          let newRows = rows.filter(
            (row, index) => !selectedRows.includes(row)
          );
          setRows(newRows);
          setSelectedRows([]);
        });
    }
  };

  return (
    <PanelLayout headerTitle="Campus Admins" defaultActiveLink="admins">
      <div className="content-wrapper">
        <CardComponent>
          <Card.Body>
            <div className=" flex-wrap flex align-items-center gap-3">
              <div>
                <Link
                  className="link-primary nav-link"
                  href={route("admin.admins.create")}
                >
                  <div className="flex gap-2 items-center fw-medium text-sm">
                    <i className="fi fi-rr-square-plus"></i>
                    <span>Create New</span>
                  </div>
                </Link>
              </div>
              <div className="cursor-pointer">
                <button
                  onClick={fetchAllAdmins}
                  disabled={fetching}
                  className="d-flex gap-2 align-items-center text-decoration-none fw-medium text-sm btn btn-link btn-sm link-primary"
                >
                  <i className="fi fi-rr-refresh"></i>
                  <span>Refresh</span>
                </button>
              </div>
              <div className="cursor-pointer">
                <button
                  onClick={deleteBtnClicked}
                  disabled={selectedRows.length == 0}
                  type="button"
                  className="d-flex align-items-center text-decoration-none gap-2 items-center btn btn-link link-danger btn-sm fw-medium text-sm"
                >
                  <i className="fi fi-rr-trash"></i>
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
            <hr />
            <DataTable
              // expandableRows
              // expandableRowsComponent={ExpandedComponent}
              columns={columns}
              data={rows}
              selectableRows
              onSelectedRowsChange={(s) => setSelectedRows(s.selectedRows)}
              pagination
              progressPending={fetching}
              progressComponent={<Spinner size="sm" />}
            />
          </Card.Body>
        </CardComponent>
      </div>
    </PanelLayout>
  );
};

export default Admins;
