import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Button, Card, Label, Table, Textarea } from "flowbite-react";
import { toast } from "react-toastify";
import TextInput from "@/Components/TextInput";
import { CpuIcon, Delete, DeleteIcon, Edit, Eye } from "lucide-react";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";

function QuestionCard({ questionData, data, currentPage }) {
  console.log(data);

  const handleDelete = () => {
    router.delete(`/opcrquestion/${data.id}`, data, {
      preserveScroll: true,
    });
  };

  const handleArchive = (id) => {
    router.put(`/opcrquestion/${id}/archive`, data, {
      preserveScroll: true,
    });
  };

  return (
    <Card className="m-3 mt-5 flex flex-col max-w-md w-[100%]">
      <div className="flex items-center">
        <div className="w-[2rem] h-[2rem]">
          <CpuIcon />
        </div>
        <h2 className=" whitespace-pre-wrap ml-3 text-lg font-bold">
          {questionData.title}
        </h2>
      </div>

      <div className="h-[50%]">
        <h2 className="font-bold mb-2">Target Indicators</h2>
        <p className="whitespace-pre-wrap">{questionData.targetIndicators}</p>
      </div>

      <div className="h-[50%]">
        <h2 className="font-bold mb-2">Remarks</h2>
        <p className="whitespace-pre-wrap">{questionData.remarks}</p>
      </div>

      <div className="w-full flex">
        {/* Q,E,T,A Input */}
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">Q</Label>
          <TextInput
            className={
              "max-w-[4rem] w-[90%] m-1 " +
              (data.isQRequired == 0 ? "border-red-600" : "border-green-400")
            } // change opacity to 50% if disabled
            label="Q"
            disabled
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">E</Label>
          <TextInput
            className={
              "max-w-[4rem] w-[90%] m-1 " +
              (data.isERequired == 0 ? "border-red-600" : "border-green-400")
            }
            label="E"
            disabled
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">T</Label>
          <TextInput
            className={
              "max-w-[4rem] w-[90%] m-1 " +
              (data.isTRequired == 0 ? "border-red-600" : "border-green-400")
            }
            label="T"
            disabled
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">A</Label>
          <TextInput
            disabled
            className="max-w-[4rem] opacity-50 w-[90%] m-1"
            label="A"
          />
        </div>
      </div>

      <div>
        {/* remarks */}
        <Label className="font-bold">Actual Accomplishments</Label>
        <Textarea className="w-full h-[8rem]" disabled />
      </div>

      {data.edited_at && (
        <div>
          {/* edited by and edit_at */}
          <p className="font-bold">
            Edited last{" "}
            {
              // jan 1, 2021 12:00 AM example
              new Date(data.edited_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            }{" "}
            by {data.user.firstname} {data.user.lastname}
          </p>
          <p></p>
        </div>
      )}

      {/* action: delete, edit */}
      <div className="flex flex-col justify-end">
        <Button className="bg-orange-600 my-2 h-[3rem] w-[100%]">
          <a href={`/opcrquestion/${data.id}/edit?page=${currentPage}`}>Edit</a>
        </Button>

        {/* archive */}
        <Button
          onClick={() => handleArchive(data.id)}
          className="bg-gray-600 my-2 h-[3rem] w-[100%]"
        >
          Archive
        </Button>
      </div>
    </Card>
  );
}

function OPCRIndex({ auth, opcrs }) {
  // flash usePage().props

  const { flash } = usePage().props;
  const [currentPage, setCurrentPage] = useState(opcrs.current_page);
  const itemsPerPage = opcrs.per_page;
  const totalPages = opcrs.last_page;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, opcrs.total);
  const [query, setQuery] = useState("");

  const Information = [];

  for (let i = 0; i < opcrs.data.length; i++) {
    Information.push({
      id: opcrs.data[i].id,
      title: opcrs.data[i].title,
      targetIndicators: opcrs.data[i].target_indicators,
      remarks: opcrs.data[i].remarks,
      q: opcrs.data[i].isQRequired == 1 ? "" : null,
      e: opcrs.data[i].isERequired == 1 ? "" : null,
      t: opcrs.data[i].isTRequired == 1 ? "" : null,
      a: opcrs.data[i].isARequired == 1 ? "" : null,
    });
  }

  useEffect(() => {
    if (flash.message) {
      toast.success(flash.message);
    }
  }, [flash]);

  console.log(query);

  useEffect(() => {
    if (query !== "") {
      router.visit("/opcrquestion", {
        data: { search: query, page: 1 },
        preserveScroll: true,
        preserveState: true,
      });
    }
  }, [query]);

  useEffect(() => {
    if (currentPage !== opcrs.current_page) {
      router.visit("/opcrquestion", {
        data: { page: currentPage },
      });
    }
  }, [currentPage]);

  console.log(opcrs);

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated reports annually"
    >
      <Head title="IPCR - Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="sm:rounded-lg">
            <Card>
              <div className="flex justify-start  items-center">
                <h2 className="font-bold text-orange-500 underline underline-offset-[1rem] mx-2 text-xl">
                  OPCR Questions
                </h2>
                <h2
                  onClick={() => {
                    router.visit("/opcrquestion/archives");
                  }}
                  className="mx-2 font-bold text-xl"
                >
                  Archives
                </h2>
              </div>
            </Card>
            <div className="flex my-4">
              <div className="flex items-end max-w-xl">
                <Button className="bg-orange-600 h-[3rem] w-[100%]">
                  <a href="/opcrquestion/create">Create OPCR Question</a>
                </Button>
              </div>
              <div className="w-[100%] flex justify-end">
                <TextInput
                  className="mt-5"
                  autoComplete="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              {/* card here */}
              {opcrs.data.map((ipcr, index) => (
                <QuestionCard
                  key={ipcr.id}
                  data={ipcr}
                  questionData={Information[index]}
                  currentPage={currentPage}
                />
              ))}
            </div>
            <div className="flex w-full justify-end mt-2">
              <nav aria-label="Page navigation example">
                <ul className="flex items-center -space-x-px h-8 text-sm">
                  <li>
                    <a
                      href="#"
                      className={`flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 ${
                        currentPage === 1 ? "rounded-l-lg" : ""
                      } ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 1 1 5l4 4"
                        />
                      </svg>
                    </a>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                          currentPage === index + 1
                            ? "bg-orange-50 text-orange-600 border-orange-300"
                            : ""
                        }`}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#"
                      className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
                        currentPage === totalPages ? "rounded-r-lg" : ""
                      } ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        endIndex >= opcrs.total || currentPage === totalPages
                      }
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-2.5 h-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}

export default OPCRIndex;
