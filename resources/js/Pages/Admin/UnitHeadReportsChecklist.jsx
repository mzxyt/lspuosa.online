import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import { Link, usePage } from "@inertiajs/react";

export default function UnitHeadReportsChecklist({ offices }) {
  const officesArr = Object.keys(offices);
  const { auth } = usePage().props;

  const statusColors = {
    Approved: "bg-emerald-600",
    Rejected: "bg-rose-600",
    Pending: "bg-amber-600",
  };

  console.log(auth);

  return (
    <PanelLayout defaultActiveLink="reports checklist">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-none">
            Reports checklist
          </h1>
          <p className="border-b border-slate-200 pb-4 leading-none mb-4 text-slate-500">
            See all the reports within
            {auth.user.role === "admin" ? "your campus." : "all campuses."}
          </p>

          {/* admin.report.open */}
          {officesArr.length ? (
            <>
              {/* {auth.user.campus} */}
              {officesArr.map((officeItem, i) => (
                <div key={i} className="mt-4">
                  <div className="pt-2 flex border-zinc-200">
                    <i className="text-slate-500 fi-rr-city text-xl mr-2"></i>
                    <p className="font-bold mb-0">{officeItem} Office</p>
                  </div>
                  <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                          <th>Unit Head</th>
                          <th>Office</th>
                          <th>Campus</th>
                          <th>Submitted Reports</th>
                        </tr>
                      </thead>

                      <tbody>
                        {offices[officeItem].map((report, i) => (
                          <tr
                            key={i}
                            className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                          >
                            <td>
                              {report.unit_head.firstname}{" "}
                              {report.unit_head.lastname}
                            </td>
                            <td>{report.unit_head.designation.name}</td>
                            <td>{report.unit_head.campus.name}</td>
                            <td>
                              <div
                                className={`inline-block mr-2 w-2 h-2 rounded-full ${
                                  statusColors[report.status]
                                }`}
                              ></div>
                              {report.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-slate-500 border-2 rounded-md border-dashed border-slate-200 py-8 text-center">
              There are currently no reports submitted for this campus.
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
