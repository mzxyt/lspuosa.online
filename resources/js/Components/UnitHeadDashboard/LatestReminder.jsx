import axios from "axios";
import { useEffect, useState } from "react";

const LatestReminder = () => {
  const [latestReminder, setLatestReminder] = useState(null);

  useEffect(() => {
    const fetchLatestReminder = () => {
      axios.get(route("reminder.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestReminder(res.data.latestReminder);
          console.log(res.data);
        }
      });
    };

    fetchLatestReminder();
  }, []);

  return (
    <div className="bg-white rounded-lg mb-4 shadow-sm border-b border-slate-300 p-4">
      <div>
        <h1 className="text-xl font-bold mb-2 leading-none">
          📌Latest reminder
        </h1>
        <p className="leading-none mb-4 text-slate-500 text-sm">
          Posted by the super admin.
        </p>
      </div>
      {latestReminder ? (
        <div className="animate-fade-up overflow-hidden px-4 p-3 rounded-md border-slate-200 border relative">
          <div className="absolute top-0 bottom-0 w-1 bg-yellow-500 left-0"></div>

          <p className="mb-0.5 font-bold">{latestReminder.title}</p>
          <p className="m-0">{latestReminder.content}</p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There is no reminder posted.
        </div>
      )}
    </div>
  );
};

export default LatestReminder;
