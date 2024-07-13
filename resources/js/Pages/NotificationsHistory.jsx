import PanelLayout from "@/Layouts/PanelLayout";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { Nav } from "react-bootstrap";

export default function NotificationsHistory({ auth, userNotifications }) {
  const NotifIcon = ({ data }) => (
    <>
      {data.type == "submission_bin" ? (
        <i className="fi fi-rr-box text-xl leading-none"></i>
      ) : (
        <i className="fi fi-rr-document text-xl leading-none"></i>
      )}
    </>
  );

  return (
    <PanelLayout userAuth={auth} defaultActiveLink="notification history">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            Notifications history
          </h1>
          <p className="leading-none mb-4 text-slate-500 text-sm">
            See all of the notifications you got.
          </p>

          {userNotifications.length > 0 ? (
            <div className="border rounded-lg overflow-hidden border-slate-200">
              {userNotifications.map((item) => (
                <Link
                  href={route("notifications.open", { id: item.id })}
                  key={item.id}
                  className="hover:bg-slate-50 border-b last:border-0 position-relative block p-3"
                >
                  <small
                    className={`flex items-start gap-2 ${
                      item.read_at
                        ? "font-normal text-slate-500"
                        : "text-slate-700 font-bold"
                    }`}
                  >
                    {<NotifIcon data={item.data} />}
                    <span>{item.data.title}</span>
                  </small>

                  <div className="mt-2.5 flex items-center">
                    {!item.read_at ? (
                      <div className="mr-2 text-indigo-500 text-xs px-1 font-semibold rounded-md border-[1px] border-indigo-300 w-max">
                        Unread
                      </div>
                    ) : null}
                    <div className="text-xs text-slate-500">
                      {dayjs(item.created_at).format("MMM D, h:m A")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-sm py-10 text-center rounded-lg text-slate-500 border-2 border-dashed border-slate-200">
              There's no notification to show
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
