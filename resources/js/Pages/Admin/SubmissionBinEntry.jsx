import { useState } from "react";
import { Card, Form, FormCheck } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { SubmissionBinEntryImageInput } from "./SubmissionBinEntryImageInput";
import { ParticipantsEntryForm } from "@/Components/ParticipantsEntryForm";
import { toast } from "sonner";

export const SubmissionBinEntry = ({
  deleteDataInEntries,
  addDataInEntries,
  id,
  entryCount,
  entry,
}) => {
  console.log(entry);
  const [data, setData] = useState({
    title: entry.title,
    event_name: entry.event_name,
    date: entry.date,
    documentation:
      typeof entry.documentation === "string"
        ? JSON.parse(entry.documentation)
        : [],
    participants:
      typeof entry.participants === "string"
        ? JSON.parse(entry.participants)
        : [],
    participants_number:
      typeof entry.participants === "string"
        ? JSON.parse(entry.participants).length
        : 0,
    location: entry.location,
    conducted_by: entry.conducted_by,
    budget: entry.budget,
  });
  const [hide, setHide] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participant, setParticipant] = useState("");

  const handleAddParticipant = () => {
    if (!participant) return;

    setParticipants((prev) => [...prev, participant]);
  };

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // check if date is current date or past date
    if (new Date(data.date) > new Date()) {
      toast.error("Date must be current or past date");
      return;
    }
    addDataInEntries(data, id);
    setHide(true);
  };

  const ge = (img) => {
    return typeof img === "object" ? URL.createObjectURL(img) : img;
  };

  return (
    <div>
      <div className="border p-4 rounded-md space-y-4">
        <header className="font-semibold text-base mb-4">
          Entry {entryCount}
          {hide && `- ${data.title ? data.title : "Untitled"}`}
        </header>
        {!hide ? (
          <div className="space-y-4">
            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Title of Activities/Program
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="title"
                id="title"
                value={data.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Name of Event
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="event_name"
                id="event_name"
                value={data.event_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Date/ Duration
              </Form.Label>
              <div className="block w-full">
                <Form.Control
                  type="date"
                  value={data.date}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Documentation (Pictures)
              </Form.Label>
              <SubmissionBinEntryImageInput data={data} setData={setData} />
              <div className="flex flex-wrap gap-4 mt-4">
                {data.documentation.length
                  ? data.documentation.map((previewImage, i) => (
                      <div key={i} className="relative">
                        <button
                          onClick={() => {
                            let files = data.documentation.filter(
                              (file) => file.name !== previewImage.name
                            );

                            setData((prevData) => ({
                              ...prevData,
                              documentation: files,
                            }));
                          }}
                          className="absolute text-xl bg-black/40 text-white backdrop-blur leading-none hover:bg-black/70 w-6 h-6 flex items-center justify-center top-2 right-2 rounded-full"
                        >
                          &times;
                        </button>

                        <img
                          src={ge(previewImage)}
                          alt="Preview"
                          className="rounded-xl w-40 h-40 object-cover"
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>

            <div className="flex">
              <div className="flex-[2]">
                <ParticipantsEntryForm
                  participants={participants}
                  setParticipants={setParticipants}
                  dataParticipants={data.participants}
                  setData={setData}
                />
              </div>

              <div className="ml-4 flex-1">
                <Form.Label className="text-secondary">
                  <span className="text-sm text-danger me-1">*</span>
                  Number of Participants
                </Form.Label>
                <p className="text-2xl font-semibold m-0">
                  {data.participants.length}
                </p>
              </div>
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Location
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="location"
                id="location"
                value={data.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <Form.Label className="text-secondary">
                <span className="text-sm text-danger me-1">*</span>
                Conducted/ Sponsored by:
              </Form.Label>
              <Form.Control
                type="text"
                required
                name="conducted_by"
                id="conducted_by"
                value={data.conducted_by}
                onChange={handleChange}
              />
            </div>

            <div className="gap-2  flex items-center">
              <FormCheck
                value={data.budget}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    budget: e.target.checked,
                  }))
                }
              />
              <Form.Label className="text-secondary m-0">
                Budget/Remark
              </Form.Label>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setHide(true)}
                className="transition bg-slate-100 text-slate-600 px-3 py-2 text-sm font-medium hover:bg-slate-200 active:bg-slate-300 rounded-md w-max"
              >
                Hide
              </button>

              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => deleteDataInEntries(id)}
                  className="transition bg-rose-100 text-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-200 active:bg-rose-300 rounded-md w-max"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="transition bg-indigo-600 text-white px-3 py-2 text-sm font-medium shadow hover:bg-indigo-400 rounded-md w-max"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setHide(false)}
              className="transition bg-slate-100 text-slate-600 px-3 py-2 text-sm font-medium hover:bg-slate-200 active:bg-slate-300 rounded-md w-max"
            >
              Show
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
