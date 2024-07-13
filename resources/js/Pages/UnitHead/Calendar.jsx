import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listViewPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import PanelLayout from "@/Layouts/PanelLayout";
import { Card } from "react-bootstrap";

export default function UnitHeadCalendar({ events }) {
  console.log("events: ", events);
  return (
    <PanelLayout defaultActiveLink="Calendar">
      <div className="content-wrapper">
        <Card className={`!rounded-lg border-0 shadow-sm`}>
          <Card.Header className="pb-0 pt-4 border-0 bg-white px-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold mb-2 leading-none">
                  Event calendar
                </h1>
                <p className="leading-none mb-4 text-slate-500 text-sm">
                  Check out the scheduled dates for events.
                </p>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="pt-0 px-4 text-sm">
            <FullCalendar
              viewClassNames={"custom-scroll"}
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                listViewPlugin,
                timeGridPlugin,
              ]}
              initialView="dayGridMonth"
              weekends:false
              events={events}
              headerToolbar={{
                left: "title",
                center: "",
                right: "prev,next",
              }}
              titleFormat={{ year: "numeric", month: "short" }}
              themeSystem="bootstrap5"
            />
          </Card.Body>
        </Card>
      </div>
    </PanelLayout>
  );
}
