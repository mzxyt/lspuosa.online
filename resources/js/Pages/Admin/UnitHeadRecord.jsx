import TextProfilePic from "@/Components/TextProfilePic";
import PanelLayout from "@/Layouts/PanelLayout";
import { MultipartHeader } from "@/constants/constants";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { Button, Card, Image, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UnitHeadRecord = ({ unitHeads }) => {
  const [rows, setRows] = useState([...unitHeads]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { auth } = usePage().props;

  const columns = [
    {
      name: "Unit Head",
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
                bg="light"
                className="text-primary fw-bold"
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
      selector: (row) => row.campus.name,
    },
    {
      name: "Classification",
      sortable: true,
      selector: (row) => row.designation.classification.name,
    },
    {
      name: "Designation",
      sortable: true,
      selector: (row) => row.designation.name,
      title: (row) => row.designation.name,
    },
    {
      name: "",
      button: true,
      cell: (row) => (
        <div className="flex">
          <Link
            href={route("admin.unit_heads.edit", { id: row.id })}
            className="fs-5 link-success nav-link"
          >
            {/* <i className='fi fi-rr-pen-square'></i> */}
            <i className="bx bx-edit bx-sm"></i>
          </Link>
          {row.is_deleted == 0 && (
            <Link
              onClick={() => {
                axios.patch(route("users.deactivate", row.id)).then(() => {
                  toast.success("Successfully deactivated!");
                });
              }}
              className="block py-1.5 text-slate-800 hover:bg-slate-100 rounded px-3"
            >
              <i className="fi text-red-500  fi-ss-user-slash"></i>
            </Link>
          )}

          {row.is_deleted == 1 && (
            <Link
              onClick={() => {
                axios.patch(route("users.activate", row.id)).then(() => {
                  toast.success("Successfully activated!");
                });
              }}
              className="block py-1.5 text-slate-800 hover:bg-slate-100 rounded px-3"
            >
              <i className="fi text-emerald-500  fi-ss-user-slash"></i>
            </Link>
          )}
        </div>
      ),
      grow: 0,
    },
  ];

  const deleteBtnClicked = () => {
    Swal.fire({
      title: "Are you sure?",
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
    formData.append("user_id", auth.user.id);
    for (let row of selectedRows) {
      formData.append("id[]", row.id);
      axios
        .post(route("unit_heads.delete.many"), formData, MultipartHeader)
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
    <PanelLayout
      headerTitle="Unit Heads"
      defaultActiveLink="unit-heads/records"
    >
      <div className="content-wrapper">
        <Card className="border-0 shadow-sm py-2 px-2 px-lg-3">
          <Card.Body>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="my-0 fw-bold">List of Unit Heads</p>
              </div>
            </div>
            <div className="mb-2">
              <div className=" flex align-items-center gap-4 flex-wrap">
                <div>
                  <Link
                    className="link-primary nav-link"
                    href={route("admin.unit_heads.create")}
                  >
                    <div className="flex gap-2 items-center fw-medium text-sm">
                      <i className="fi fi-rr-square-plus"></i>
                      <span>Create New</span>
                    </div>
                  </Link>
                </div>
                <div className="cursor-pointer">
                  <button className="d-flex gap-2 align-items-center text-decoration-none fw-medium text-sm btn btn-link btn-sm link-primary">
                    <i className="fi fi-rr-refresh"></i>
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="cursor-pointer">
                  <button
                    type="button"
                    onClick={deleteBtnClicked}
                    disabled={selectedRows.length == 0}
                    className="d-flex align-items-center text-decoration-none gap-2 items-center btn btn-link link-danger btn-sm fw-medium text-sm"
                  >
                    <i className="fi fi-rr-trash"></i>
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>
            </div>
            {/* <hr /> */}
            <DataTable
              selectableRows
              onSelectedRowsChange={(selected) =>
                setSelectedRows(selected.selectedRows)
              }
              columns={columns}
              data={rows}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 100]}
              pagination
            />
          </Card.Body>
        </Card>
      </div>
    </PanelLayout>
  );
};

export default UnitHeadRecord;
