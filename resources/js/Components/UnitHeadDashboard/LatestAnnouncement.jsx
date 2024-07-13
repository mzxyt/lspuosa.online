import axios from "axios";
import { useEffect, useState } from "react";

const LatestAnnouncement = () => {
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    const fetchLatestAnnouncement = () => {
      axios.get(route("announcements.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestAnnouncement(res.data.latestAnnouncement);
        }
      });
    };

    fetchLatestAnnouncement();
  }, []);

  return (
    <div className="mb-4 bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
      <div>
        <h1 className="text-xl font-bold mb-2 leading-none">
          📣Latest announcement
        </h1>
        <p className="leading-none mb-4 text-slate-500 text-sm">
          Posted by the super admin.
        </p>
      </div>
      {latestAnnouncement ? (
        <div className="animate-fade-up overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
          <div className="absolute top-0 bottom-0 w-1 bg-blue-500 left-0"></div>
          <p className="mb-0.5 font-bold">{latestAnnouncement.title}</p>
          <p className="m-0">{latestAnnouncement.content}</p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There is no announcement posted.
        </div>
      )}
    </div>
  );
};

export default LatestAnnouncement;
