import { Link } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const LatestSubmissionBin = () => {
  const [latestSubmissionBin, setLatestSubmissionBin] = useState(null);

  useEffect(() => {
    const fetchLatestSubmissionBin = () => {
      axios.get(route("submission-bins.latest")).then((res) => {
        if (res.statusText === "OK") {
          setLatestSubmissionBin(res.data.latestSubmissionBin);
          console.log(res.data);
        }
      });
    };

    fetchLatestSubmissionBin();
  }, []);

  return (
    <div className="bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
      <div>
        <h1 className="text-xl font-bold mb-2 leading-none">
          Latest submission bin
        </h1>
        <p className="leading-none mb-4 text-slate-500 text-sm">
          Posted by the super admin.
        </p>
      </div>
      {latestSubmissionBin ? (
        <>
          <div className="animate-fade-up overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
            <div className="absolute top-0 bottom-0 w-1 bg-green-500 left-0"></div>
            <p className="mb-0.5 font-bold">{latestSubmissionBin.title}</p>
            <p className="m-0 truncate max-w-[40ch]">
              {latestSubmissionBin.instruction}
            </p>
          </div>
          <div className="flex mt-3 items-center justify-between">
            <p className="text-sm m-0">
              Due on{" "}
              {dayjs(
                latestSubmissionBin.deadline_date +
                  " " +
                  latestSubmissionBin.deadline_time
              ).format("MMM D [at] H:mm A")}
            </p>
            <Link
              href={route("unit_head.submission_bin", {
                id: latestSubmissionBin.id,
              })}
              className="text-slate-800 hover:bg-slate-200 text-sm px-3 font-semibold py-2 rounded-md bg-slate-100"
            >
              Open submission bin
            </Link>
          </div>
        </>
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There is no submission bin posted.
        </div>
      )}
    </div>
  );
};

export default LatestSubmissionBin;
