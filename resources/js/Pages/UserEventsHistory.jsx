import PanelLayout from "@/Layouts/PanelLayout";
import dayjs from "dayjs";

export default function UserEventsHistory({ auth, userEvents }) {
  return (
    <PanelLayout userAuth={auth} defaultActiveLink="user events history">
      <div className="content-wrapper">
        <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white">
          <h1 className="text-xl font-bold mb-2 leading-none">
            User events history
          </h1>
          <p className="leading-none mb-4 text-slate-500 text-sm">
            See all the actions made within the system.
          </p>

          {userEvents.length > 0 ? (
            <div className="border rounded-lg border-slate-200">
              {userEvents.map((userEvent) => (
                <div
                  key={userEvent.id}
                  className="border-b last:border-0 border-slate-200 p-3"
                >
                  <div className="flex gap-2">
                    <div className="mb-2 text-xs font-semibold px-2 text-slate-500 py-0.5 rounded-md border-[1px] border-slate-200 w-max">
                      {userEvent.event_name}
                    </div>
                    {userEvent === userEvents[0] ? (
                      <div className="text-indigo-500 mb-2 text-xs font-semibold px-2 py-0.5 rounded-md border-[1px] border-indigo-300 w-max">
                        Latest
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div className="flex space-x-1 text-sm">
                      <p className="w-max font-semibold mb-0">
                        {userEvent.user_name ===
                        `${auth.user.firstname} ${auth.user.lastname}`
                          ? "You"
                          : userEvent.user_name}
                      </p>
                      <p className="flex-1 mb-0">{userEvent.description}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 text-xs text-slate-500">
                    {dayjs(userEvent.created_at).format("MMM D, h:m A")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm py-10 text-center rounded-lg text-slate-500 border-2 border-dashed border-slate-200">
              There's no user events
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
