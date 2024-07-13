import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import axios, { all } from "axios";

const Chart = () => {
  const [allReports, setAllReports] = useState({
    loading: true,
    data: null,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAllReports = () => {
      axios.get(route("reports.summary.index")).then((res) => {
        setAllReports({ loading: false, data: res.data.data });
      });
    };

    fetchAllReports();
  }, []);

  useEffect(() => {
    if (allReports.data) {
      const campusNames = Object.keys(allReports.data);

      const data = [];

      campusNames.forEach((campusName) => {
        const campus = allReports.data[campusName];
        const total = campus.total;
        const offices = Object.keys(campus.offices);
        const temp = { name: campusName, offices: {}, total: total };
        offices.forEach((office) => {
          temp.offices[office] = campus.offices[office];
        });
        data.push(temp);
      });

      setChartData(data);
      setAllReports((prev) => ({ ...prev, loading: false }));
    }
  }, [allReports.data]);

  return (
    <div className="p-4 border-b border-slate-300 rounded-lg shadow-sm bg-white mb-8">
      <h1 className="text-xl font-bold mb-2 leading-none">
        Total reports per campus
      </h1>
      <p className="leading-none mb-4 text-slate-500 text-sm">
        View all of the reports that have been turned in over the last 30 days.
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          className="w-full"
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" dy={6} />
          <YAxis allowDecimals={false} dx={-6} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            wrapperClassName="shadow-xl !border-transparent rounded-md"
            contentStyle={{
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 20px",
            }}
            cursor={{ fill: "#a1a1aa", fillOpacity: 0.1 }}
            content={<CustomTooltip />}
          />
          <Bar radius={[5, 5, 0, 0]} dataKey="total" fill="#60a5fa" />
          {
            /* <Bar radius={[5, 5, 0, 0]} dataKey="offices.office1" fill="#82ca9d" /> */
            Object.keys(chartData[0]?.offices ?? {}).map((office) => (
              <Bar
                radius={[5, 5, 0, 0]}
                dataKey={`offices.${office}`}
                fill="#2dd4bf"
              />
            ))
          }
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
