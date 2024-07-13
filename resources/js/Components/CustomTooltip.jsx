// recharts doesn't export the default tooltip,
// but it's located in the package lib so you can get to it anyways
import DefaultTooltipContent from "recharts/lib/component/DefaultTooltipContent";

const CustomTooltip = (props) => {
  if (props.active && props.payload) {
    console.log(props);
    return (
      <div className="grid grid-cols-2 z-[999] p-2 gap-2 rounded-lg shadow-sm bg-white">
        {props.payload.map((item) => (
          <div
            key={item.dataKey}
            className={`border-[1px] border-zinc-200 rounded text-sm font-medium text-slate-800 p-2 last:!mb-0 ${
              item.dataKey === "total" ? "uppercase" : "capitalize"
            }`}
          >
            <p className={`m-0`}>{item.dataKey.replace("offices.", "")}</p>
            <div>
              <p
                style={{
                  color: item.fill,
                }}
                className="m-0 text-3xl capitalize font-bold"
              >
                {item.dataKey !== "total"
                  ? item.payload.offices[item.dataKey.replace("offices.", "")]
                  : item.payload.total}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default CustomTooltip;
