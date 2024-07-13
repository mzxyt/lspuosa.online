import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Button, Table } from "flowbite-react";
import { toast } from "react-toastify";
import TextInput from "@/Components/TextInput";
import { Delete, DeleteIcon, Edit, Eye } from "lucide-react";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";

function Index({ auth, opcrs }) {
  // flash usePage().props

  const { flash } = usePage().props;
  const [currentPage, setCurrentPage] = useState(opcrs.current_page);
  const itemsPerPage = opcrs.per_page;
  const totalPages = opcrs.last_page;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, opcrs.total);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (flash.message) {
      toast.success(flash.message);
    }
  }, [flash]);

  console.log(query);

  useEffect(() => {
    // get clients using inertia built in get
    if (query != "") {
      router.visit("/opcr", {
        data: { search: query, page: 1 },
        preserveScroll: true,
        preserveState: true,
      });
    }
  }, [query, currentPage]);

  useEffect(() => {
    if (currentPage !== opcrs.current_page) {
      router.visit("/opcr", {
        data: { page: currentPage },
      });
    }
  }, [currentPage]);

  console.log(opcrs);

  // delete opcr
  const deleteOpcr = (id) => {
    router.delete(`/opcr/${id}`);
  };

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated reports annually"
    >
      <Head title="OPCR - Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="sm:rounded-lg">
            <div className="flex my-4">
              <div className="flex items-end max-w-xl">
                <Button className="bg-orange-600 h-[3rem] w-[100%]">
                  <a href="/opcr/create">Evaluate</a>
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
            <div className="overflow-scroll overflow-y-hidden">
              {/* Table */}
              <Table className="mt-5">
                <Table.Head>
                  <Table.HeadCell className="text-left">
                    First Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-left">
                    Middle Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-left">
                    Last Name
                  </Table.HeadCell>
                  <Table.HeadCell className="text-left">
                    Position
                  </Table.HeadCell>
                  <Table.HeadCell className="text-left">
                    Evaluator
                  </Table.HeadCell>
                  <Table.HeadCell className="text-left">
                    Evaluated on
                  </Table.HeadCell>
                  <Table.HeadCell className="text-left">Action</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {opcrs.data.length === 0 && (
                    <Table.Row>
                      <Table.Cell className="text-center p-10" colSpan={6}>
                        No data found.
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {opcrs.data.map((opcr) => (
                    <Table.Row key={opcr.id}>
                      <Table.Cell>{opcr.user.firstname}</Table.Cell>
                      <Table.Cell>{opcr.user.middlename}</Table.Cell>
                      <Table.Cell>{opcr.user.lastname}</Table.Cell>
                      <Table.Cell>{opcr.user.position}</Table.Cell>
                      <Table.Cell>
                        {opcr.user.firstname} {opcr.user.middlename}{" "}
                        {opcr.user.lastname}
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(opcr.created_at).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="flex">
                        <a href={`/opcr/${opcr.id}/edit`} className="mr-2">
                          <Edit color="orange" />
                        </a>

                        <a
                          href="#"
                          onClick={() => deleteOpcr(opcr.id)}
                          className="mr-2"
                        >
                          <DeleteIcon color="orange" />
                        </a>

                        <a href={`/opcr/${opcr.id}`} className="mr-2">
                          <Eye color="orange" />
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  {/* check if no data */}
                </Table.Body>
              </Table>
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

export default Index;
