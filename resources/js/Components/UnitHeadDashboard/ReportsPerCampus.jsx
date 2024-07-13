import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const ReportsPerCampus = () => {
  const [campuses, setCampuses] = useState(null);
  const [reports, setReports] = useState({
    Siniloan: 0,
    "Sta. Cruz": 0,
    "Los Baños": 0,
    "San Pablo": 0,
  });

  useEffect(() => {
    const fetchReportsPerCampus = () => {
      axios.get(route("reports.per_campus.index")).then((res) => {
        if (res.statusText === "OK") {
          setCampuses(res.data.campuses);
          res.data.reports.map((reportData) => {
            setReports((val) => ({
              ...val,
              [reportData.unit_head.campus.name]:
                val[reportData.unit_head.campus.name] + 1,
            }));
          });
        }
      });
    };

    fetchReportsPerCampus();
  }, []);

  return (
    <div className="mb-4">
      <p className="font-bold text-slate-800 text-xl mt-2 mb-2">
        Total reports
      </p>
      {campuses ? (
        <div className="grid xl:grid-cols-2 gap-4">
          {campuses.map((campus) => (
            <div
              key={campus.id}
              className="bg-white p-4 rounded-lg border-b border-slate-300 shadow-sm"
            >
              <p>{campus.name}</p>
              <h1 className="text-3xl font-semibold">{reports[campus.name]}</h1>
            </div>
          ))}
        </div>
      ) : (
        <div>no campuses.</div>
      )}
    </div>
  );
};

export default ReportsPerCampus;
