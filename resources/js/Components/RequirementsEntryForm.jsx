import { useState } from "react";
import { Form } from "react-bootstrap";

export const RequirementsEntryForm = ({ requirements, setRequirements }) => {
  const [requirement, setRequirement] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="mt-10">
      <h1 className="text-lg font-bold mb-4 leading-none">Requirements</h1>

      <ul className="p-0 divide-y overflow-hidden border border-slate-200 rounded-md leading-none">
        {requirements.length ? (
          requirements.map((requirement) => (
            <li
              key={requirement.id}
              className="hover:bg-slate-100 flex items-center relative justify-between py-3 pr-4 pl-4"
            >
              <div className="flex items-center space-x-4">
                <span className="block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <div>
                  <b className="mb-2 block">{requirement.title}</b>
                  <p className="mb-0">{requirement.requirement}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const newArr = requirements.filter(
                    (req) => req.id !== requirement.id
                  );
                  setRequirements([...newArr]);
                }}
                className="bg-white border-[1px] border-rose-600 hover:!bg-rose-600 hover:text-white transition rounded text-rose-600 p-2"
              >
                <i className="fi fi-rr-trash"></i>
              </button>
            </li>
          ))
        ) : (
          <li className="text-center py-10 text-slate-500">
            No requirement yet.
          </li>
        )}
      </ul>

      <div className="space-x-4 flex items-center">
        <div className="flex-1">
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        </div>
        <div className="flex-[2]">
          <Form.Control
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Enter requirement"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (!requirement) {
              return;
            } else {
              setRequirements((prevEntries) => [
                ...prevEntries,
                {
                  id: crypto.randomUUID(),
                  requirement,
                  title,
                },
              ]);

              setRequirement("");
              setTitle("");
            }
          }}
          className="ml-4 bg-slate-100 my-2 px-3 w-max rounded-md font-medium text-slate-600 py-2 hover:bg-slate-200 outline outline-2 active:bg-slate-300 outline-transparent flex space-x-2 items-center focus:outline-indigo-600"
        >
          <i className="bx bx-plus"></i>
          <span>Add Requirement</span>
        </button>
      </div>
    </div>
  );
};
