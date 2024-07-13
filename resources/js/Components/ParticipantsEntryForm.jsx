import { useState } from "react";
import { Form } from "react-bootstrap";

export const ParticipantsEntryForm = ({
  participants,
  setParticipants,
  dataParticipants,
  setData,
}) => {
  const [participant, setParticipant] = useState("");

  return (
    <div>
      <Form.Label class="text-slate-500 mb-2">
        <span className="text-sm text-danger me-1">*</span>
        Participants
      </Form.Label>

      <ul className="p-0 divide-y overflow-hidden border border-slate-200 rounded-md leading-none">
        {participants.length ? (
          participants.map((participant) => (
            <li
              key={participant.id}
              className="hover:bg-slate-100 flex items-center relative justify-between py-2 pr-2 pl-4"
            >
              <div className="flex items-center space-x-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <p className="mb-0">{participant.participant}</p>
              </div>

              <button
                onClick={() => {
                  const newArr = participants.filter(
                    (req) => req.id !== participant.id
                  );
                  setParticipants([...newArr]);
                }}
                className="bg-white border-[1px] border-rose-600 hover:!bg-rose-600 hover:text-white transition rounded text-rose-600 p-2"
              >
                <i className="fi fi-rr-trash"></i>
              </button>
            </li>
          ))
        ) : (
          <li className="text-center py-10 text-slate-500">
            No participant yet.
          </li>
        )}
      </ul>

      <div className="flex items-center">
        <div className="flex-1">
          <Form.Control
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            placeholder="Enter participant"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (!participant) {
              return;
            } else {
              setParticipants((prevEntries) => [
                ...prevEntries,
                {
                  id: crypto.randomUUID(),
                  participant,
                },
              ]);

              setParticipant("");
            }
          }}
          className="ml-4 bg-slate-100 my-2 px-3 w-max rounded-md font-medium text-slate-600 py-2 hover:bg-slate-200 outline outline-2 active:bg-slate-300 outline-transparent flex space-x-2 items-center focus:outline-indigo-600"
        >
          <i className="bx bx-plus"></i>
          <span>Add Participant</span>
        </button>
        {dataParticipants.every((p) => participants.includes(p)) &&
        participants.every((p) => dataParticipants.includes(p)) ? null : (
          <button
            onClick={() => {
              setData((prev) => ({ ...prev, participants }));
            }}
            className="ml-4 bg-indigo-600 my-2 px-3 w-max rounded-md font-medium text-white py-2 hover:bg-indigo-5 00 outline outline-2 outline-transparent flex space-x-2 items-center focus:outline-indigo-600"
          >
            <span>Save</span>
          </button>
        )}
      </div>
    </div>
  );
};
