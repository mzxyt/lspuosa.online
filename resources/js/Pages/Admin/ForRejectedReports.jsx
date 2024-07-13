import FileIcon from "@/Components/FileIcon";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";
import dayjs from "dayjs";

export default function ForReviewReports({ auth, reportsForRejected }) {
  return (
    <PanelLayout
      layout={LayoutType.ADMIN}
      pageTitle="Reports | For rejected"
      defaultActiveLink="for rejected"
    >
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-2xl tracking-tight font-semibold mb-2 leading-none">
            For rejected
          </h1>
          <p className="leading-none mb-4 text-slate-500">
            See all the reports that was rejected.
          </p>

          {reportsForRejected.length > 0 ? (
            <div className="mt-4 border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="[&>th]:text-slate-500 [&>th]:bg-slate-50 [&>th]:border-l [&>th:first-child]:border-0 [&>th]:px-5 [&>th]:py-2.5 border-b [&>th]:text-sm [&>th]:font-medium">
                    <th>Name</th>
                    <th>Date Submitted</th>
                    <th>Campus</th>
                    <th>Office</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reportsForRejected.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-slate-200 last:border-0 [&>td]:text-sm [&>td]:border-l [&>td:first-child]:border-0 [&>td]:px-5 [&>td]:py-4"
                    >
                      <td>
                        {report.unit_head.firstname} {report.unit_head.lastname}
                      </td>
                      <td>{dayjs(report.created_at).format("MMM. D, YYYY")}</td>
                      <td>{report.unit_head.campus.name}</td>
                      <td>{report.unit_head.designation.name}</td>
                      <td>
                        <Link
                          href={route("admin.report.open", report.id)}
                          className="hover:underline"
                        >
                          View Reports
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm py-10 text-center rounded-lg text-slate-500 border-2 border-dashed border-slate-200">
              No rejected reports.
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
