import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { toast } from "sonner";
import { ObjectiveTableInput } from "./ObjectiveTableInput";
import ModalComponent from "./ModalComponent";

const Objective = ({ user }) => {
  const [objectives, setObjectives] = useState([]);
  const [inputData, setInputData] = useState({});

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await axios.get(route("objectives.user.all", user.id));
        setObjectives(res.data);
        seedInputData(res.data); // Seed the inputData state with required fields
      } catch (error) {
        console.error("Error fetching objectives:", error);
      }
    };

    fetchObjectives();
  }, [user.id, user.designation.id]);

  // Function to seed the inputData state with the required input fields for each entry
  const seedInputData = (objectives) => {
    const data = {};
    objectives.forEach((objective) => {
      objective.entries.forEach((entry) => {
        switch (user.designation.id) {
          case 1:
            data[entry.id] = {
              programActivity: "",
              satisfactionRating: "",
              guidanceServices: "",
              documentation: null,
            };
            break;
          case 2:
            data[entry.id] = {
              attendance: "",
              printedMaterials: "",
              typeOfMaterials: "",
              satisfactionRating: "",
              documentation: null,
            };
            break;
          case 3:
            data[entry.id] = {
              jobConducted: "",
              satisfactionRating: "",
              documentation: null,
            };
            break;
          case 4:
            data[entry.id] = {
              numOfProvidedCopy: "",
              documentation: null,
            };
            break;
          case 5:
            data[entry.id] = {
              studentNumber: "",
              activitiesNumber: "",
              numOfActMonitored: "",
              documentation: null,
            };
            break;
          case 6:
            data[entry.id] = {
              relatedActivitiesNumber: "",
              satisfactionRating: "",
              documentation: null,
            };
            break;
          case 7:
            data[entry.id] = {
              casesSettledNumber: "",
              documentation: null,
            };
            break;
          case 8:
            data[entry.id] = {
              paperNumber: "",
              trainingWorkshopNumber: "",
              enrolledStudentsNumber: "",
              documentation: null,
            };
            break;
          case 9:
            data[entry.id] = {
              conductedRelatedActivities: "",
              obtainedFourPointZeroSatRating: "",
              documentation: null,
            };
            break;
          case 10:
            data[entry.id] = {
              submitAfterEnrollment: "",
              scholarsNumber: "",
              conductedActivityPerSemNumber: "",
              documentation: null,
            };
            break;
          case 11:
            data[entry.id] = {
              conductedActivityNumber: "",
              satisfactionRating: "",
              documentation: null,
            };
            break;
          case 12:
            data[entry.id] = {
              evaluatedFoodNumber: "",
              documentation: null,
            };
            break;
          case 13:
            data[entry.id] = {
              conductedActivityNumber: "",
              satisfactionRating: "",
              assistanceNumber: "",
              sanitationProgram: "",
              documentation: null,
            };
            break;
          case 14:
            data[entry.id] = {
              satisfactionObtained: "",
              safetyAndSecurity: "",
              documentation: null,
            };
            break;
          case 15:
            data[entry.id] = {
              monitoredStudentNumber: "",
              documentation: null,
            };
            break;
          case 16:
            data[entry.id] = {
              monitoredStudentNumber: "",
              satisfactionRating: "",
              documentation: null,
            };
            break;
          case 17:
            data[entry.id] = {};
            break;
          case 18:
            data[entry.id] = {
              internalPolicy: "",
              documentation: null,
            };
            break;
          case 19:
            data[entry.id] = {
              conductedCulturalAndArtsNumber: "",
              satisfactionRating: "",
              conductedTrainingNumber: "",
              attendedNumber: "",
              documentation: null,
            };
            break;
          case 20:
            data[entry.id] = {
              conductedIndividPhysicalFitnessNumber: "",
              satisfactionRating: "",
              documentation: null,
            };
            break;
          case 21:
            data[entry.id] = {
              conductedIndividPhysicalFitnessNumber: "",
              satisfactionRating: "",
              preparedAndSubmittedx: "",
              accReport: "",
              conductedMeetingsNumber: "",
              announcementNumber: "",
              researchNumber: "",
              documentation: null,
            };
            break;
          case 22:
            data[entry.id] = {
              accommodatedApplNumber: "",
              admittedNumber: "",
              documentation: null,
            };
            break;
        }
      });
    });
    setInputData(data);
  };
  const handleEntryStatusUpdate = (entryId, objectiveId) => {
    console.log("Updating entry status for entryId:", entryId); // Debug statement

    // Check if any required input for the current entry is empty
    if (!isInputComplete(entryId)) {
      console.log("Incomplete input for entryId:", entryId); // Debug statement
      toast.error(
        "Please fill in all the required input fields for this entry."
      );
      return; // Prevent status update
    }

    console.log(inputData[entryId].documentation); // Debug statement (input data for the current entry

    // Create a new FormData object
    const formData = new FormData();

    // Add the input data to the FormData object
    formData.append("_method", "PUT");
    formData.append("id", entryId);
    formData.append("status", 1);

    // Convert info_data to JSON string if it's an object
    const info_data = inputData[entryId];
    if (typeof info_data === "object") {
      // create new object to remove the documentation key
      const newInfoData = { ...info_data };
      delete newInfoData.documentation;
      formData.append("info_data", JSON.stringify(newInfoData));
    } else {
      // create new object to remove the documentation key
      const newInfoData = { ...info_data };
      delete newInfoData.documentation;

      formData.append("info_data", newInfoData);
    }

    // Add the file input to the FormData object
    if (inputData[entryId].documentation) {
      formData.append("documentation", inputData[entryId].documentation);
    }

    // Proceed with status update if all inputs are filled
    axios
      .post(route("objectives.user.update", { id: objectiveId }), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          console.log("res:", res);
          // Filter out the updated entry from the objectives array
          const updatedObjectives = objectives.map((objective) => {
            if (objective.id === objectiveId) {
              return {
                ...objective,
                entries: objective.entries.map((entry) =>
                  entry.id === entryId ? { ...entry, status: true } : entry
                ),
              };
            } else {
              return objective;
            }
          });
          // reload
          window.location.reload();
          setObjectives(updatedObjectives);
        }
      })
      .catch((error) => console.error("Error updating entry status:", error));
  };

  const handleObjectiveSubmit = (objectiveId) => {
    console.log("Submitting objective for objectiveId:", objectiveId); // Debug statement
    axios
      .put(route("objectives.update"), {
        id: objectiveId,
        is_completed: true,
        admin_status: 0,
      })
      .then((res) => {
        if (res.statusText === "OK") {
          console.log("res:", res);
          toast.success("target submitted successfully.");
          // Filter out the updated objective from the objectives array
          const updatedObjectives = objectives.filter(
            (objective) => objective.id !== objectiveId
          );
          // reload
          window.location.reload();
          setObjectives(updatedObjectives);
        }
      })
      .catch((error) => console.error("Error submitting objective:", error));
  };

  const handleInputChange = (entryId, column, value) => {
    console.log(value);

    if (column === "documentation") {
      setInputData((prevInputData) => ({
        ...prevInputData,
        [entryId]: {
          ...prevInputData[entryId],
          documentation: value[0],
        },
      }));
    } else {
      setInputData((prevInputData) => ({
        ...prevInputData,
        [entryId]: {
          ...prevInputData[entryId],
          [column]: value,
        },
      }));
    }
  };

  const isInputComplete = (entryId) => {
    const data = inputData[entryId];
    console.log(data);
    if (!data) return false; // Entry data not found
    if (!data.documentation) return false;
    // Check if any input field in the entry data is empty, excluding the documentation field
    return Object.keys(data)
      .filter((key) => key !== "documentation")
      .every((key) => {
        const value = data[key];
        if (typeof value === "string") {
          return value.trim() !== "";
        } else if (value === null || value === undefined) {
          return true;
        } else {
          return Object.values(value).every((fileValue) => fileValue !== null);
        }
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);

  return (
    <div className="mb-4 bg-white shadow-sm border-b border-slate-300 rounded-lg p-4">
      <div>
        <h1 className="text-xl font-bold mb-2 leading-none">Targets</h1>
        <p className="leading-none mb-4 text-slate-500 text-sm">
          Please finish the following tasks.
        </p>
      </div>
      <ModalComponent
        size="md"
        centered={true}
        show={showModal}
        handleClose={() => setShowModal(false)}
        closeButton
        title="Confirm Submit Target"
      >
        {/* are you sure you wannt submit the target? */}

        {/* are you sure you want to submit target? */}
        <div>
          <p>Are you sure you want to submit target?</p>
          <button
            onClick={() => {
              handleEntryStatusUpdate(selectedEntryId, selectedObjectiveId);
              setShowModal(false);
            }}
            className="bg-blue-500 text-white py-1 px-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </ModalComponent>
      {console.log(objectives.length)}
      {objectives.length != 0 ? (
        objectives.map((objective) =>
          !objective.is_completed || objective.admin_status == 2 ? (
            <Card key={objective.id} className="mb-1">
              <div className="absolute top-0 bottom-0 w-1 bg-blue-500 rounded-md left-0"></div>
              {objective.entries.length !== 0 ? (
                <div>
                  <div className="flex flex-col text-sm py-6">
                    <h1 className=" ml-5 mb-2 leading-none">
                      <span className="font-bold text-xl">
                        {objective.objective.title}
                      </span>
                      {/* <span>{objective.admin_status == 2 && ()</span> */}

                      {objective.admin_status == 2 && (
                        <span className="font-normal text-lg bg-red-500 text-white py-1 px-2 rounded-lg ml-2">
                          For Review
                        </span>
                      )}
                    </h1>
                    <p className="ml-5">Comment : {objective.comment}</p>
                  </div>

                  {objective.entries.map((entry) => (
                    <Card
                      key={entry.id}
                      className="ml-5 flex flex-col mb-1 p-2 pt-3 w-[97%] h-[2rem] border-2 border-dashed border-slate-200 rounded-md"
                    >
                      <div className="fex flex-col ml-5 justify-center">
                        <div>
                          <h1 className="text-xl font-bold leading-none">
                            {entry.objective_entry.title}
                          </h1>
                          <p>{entry.objective_entry.description}</p>
                        </div>
                        <p className="leading-none mb-4 text-slate-500 text-sm">
                          {entry.status ? (
                            "Completed"
                          ) : user.designation.id === 1 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                programActivity:
                                  "Number of Program activity for the students",
                                satisfactionRating:
                                  "Satisfaction rating of program/activity conducted",
                                guidanceServices:
                                  "Number of students seeks guidance and counseling services",
                              }}
                            />
                          ) : user.designation.id === 2 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                attendance: "Number of Attendance",
                                printedMaterials: "No of Printed Materials",
                                typeOfMaterials: "Type of Materials",
                                satisfactionRating: "Satisfaction Rating",
                              }}
                            />
                          ) : user.designation.id === 3 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                jobConducted:
                                  "Number of Job Orientations conducted",
                                satisfactionRating:
                                  "Career Orientation satisfaction rating",
                              }}
                            />
                          ) : user.designation.id === 4 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                numOfProvidedCopy:
                                  "Number of first year students provided copy of Student Handbook",
                              }}
                            />
                          ) : user.designation.id === 5 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                studentNumber:
                                  "Number of student Organizations",
                                activitiesNumber:
                                  "Number of activities to ensure the effectiveness and efficiency of the services to the studentry.",
                                numOfActMonitored:
                                  "Number of student organization activities monitored and supervised",
                              }}
                            />
                          ) : user.designation.id === 6 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                relatedActivitiesNumber:
                                  "Number of conducted of student related activities",
                                satisfactionRating:
                                  "Satisfaction rating of conducted of student related activities",
                              }}
                            />
                          ) : user.designation.id === 7 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                casesSettledNumber: "Number of cases settled",
                              }}
                            />
                          ) : user.designation.id === 8 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                paperNumber:
                                  "Number of printed newspaper/journal/magazines, newsletter",
                                trainingWorkshopNumber:
                                  "Number of Training Workshop and press conference attended",
                                enrolledStudentsNumber:
                                  "Number of enrolled students provided a copy of newsletter/ magazine per sem",
                              }}
                            />
                          ) : user.designation.id === 9 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                conductedRelatedActivities:
                                  "Conducted at least 2 student related activities",
                                obtainedFourPointZeroSatRating:
                                  "Student related activities obtained 4.0 satisfaction rating",
                              }}
                            />
                          ) : user.designation.id === 10 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                submitAfterEnrollment:
                                  "Prepare and submit one (1) scholarship report after enrollment",
                                scholarsNumber:
                                  "Number of scholars and grantees monitored",
                                conductedActivityPerSemNumber:
                                  "Number of conducted activity per sem",
                              }}
                            />
                          ) : user.designation.id === 11 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                conductedActivityNumber:
                                  "Number of Program Activity conducted",
                                satisfactionRating:
                                  "Program Activity Rated Satisfaction Rating",
                              }}
                            />
                          ) : user.designation.id === 12 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                evaluatedFoodNumber:
                                  "Number of evaluated and monitored Food Establishments",
                              }}
                            />
                          ) : user.designation.id === 13 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                conductedActivityNumber:
                                  "Number of conducted health program/activity to at least 50% students",
                                satisfactionRating:
                                  "Satisfaction rating of Health-related activities",
                                assistanceNumber:
                                  "Number of students that seeks medical assistance",
                                sanitationProgram:
                                  "Sanitation program & secure water analysis certification for effective and efficient services.",
                              }}
                            />
                          ) : user.designation.id === 14 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                satisfactionObtained:
                                  "Obtained Satisfaction rating number of safety and security related activities",
                                safetyAndSecurity:
                                  "Conduct of safety and security and/or physical drill within the university following the minimum health standard",
                              }}
                            />
                          ) : user.designation.id === 15 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                monitoredStudentNumber:
                                  "Number of monitored student housing within the vicinity of the University",
                              }}
                            />
                          ) : user.designation.id === 16 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                monitoredStudentNumber:
                                  "Number of conducted program/activity designed to meet the needs of students in religious/spiritual aspect",
                                satisfactionRating:
                                  "Satisfaction rating of multi-faith services related activities",
                              }}
                            />
                          ) : user.designation.id === 17 ? null : user
                              .designation.id === 18 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                internalPolicy:
                                  "Craft one (1) guideline/internal policy for various group with special",
                              }}
                            />
                          ) : user.designation.id === 19 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                conductedCulturalAndArtsNumber:
                                  "Number of conducted cultural and arts activity within the semester",
                                satisfactionRating:
                                  "Satisfaction Rating of Culture and Arts related activities",
                                conductedTrainingNumber:
                                  "Number of conducted training for student artists",
                                attendedNumber:
                                  "Number of Attended training related to culture and arts either in local, regional, and national level",
                              }}
                            />
                          ) : user.designation.id === 20 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                conductedIndividPhysicalFitnessNumber:
                                  "Number of conducted individualized physical fitness program",
                                satisfactionRating:
                                  "Satisfaction Rating of Sport related programs implemented",
                              }}
                            />
                          ) : user.designation.id === 21 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                conductedIndividPhysicalFitnessNumber:
                                  "Number of conducted community-based activity related to student development",
                                satisfactionRating:
                                  "Satisfaction Rating of Conducted Clientele Satisfaction Survey every semester with 4.0 satisfaction rating (using the CC as result of ARTA survey conducted by MIS)",
                                preparedAndSubmittedx:
                                  "Prepared and submitted quarterly reports from various units",
                                accReport:
                                  "Accomplishment Report, collected, prepared, submitted (Quarterly/Annually as Requested)",
                                conductedMeetingsNumber:
                                  "Number of Conducted and Attended meetings",
                                announcementNumber:
                                  "Number of announcement posted offline and/or online platforms",
                                researchNumber:
                                  "Number of research for SAS conducted",
                              }}
                            />
                          ) : user.designation.id === 22 ? (
                            <ObjectiveTableInput
                              handleInputChange={handleInputChange}
                              inputData={inputData}
                              entry={entry.id}
                              data={{
                                accommodatedApplNumber:
                                  "Number of accommodated applicants from various high schools in the province and nearby provinces",
                                admittedNumber: "Number of admitted students",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                      {!entry.status && (
                        <div className="flex justify-end h-[2rem] w-full mr-2">
                          <button
                            onClick={() => {
                              setSelectedEntryId(entry.id);
                              setSelectedObjectiveId(objective.id);
                              setShowModal(true);
                            }}
                            className="bg-emerald-500 text-white py-1 px-2 rounded-md"
                          >
                            Confirm your entry
                          </button>
                        </div>
                      )}
                    </Card>
                  ))}
                  <div className="flex ml-5 mb-2 items-center justify-end">
                    {parseFloat(
                      objective.entries.filter((entry) => entry.status).length /
                        objective.entries.length
                    ) *
                      100 ===
                    100 ? (
                      <button
                        onClick={() => handleObjectiveSubmit(objective.id)}
                        className="bg-blue-500 mt-3 text-white py-1 px-2 rounded-md mr-2"
                      >
                        Submit Target
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                <Card className="animate-fade-up overflow-hidden p-3 px-4 rounded-md border-slate-200 border relative">
                  <div className="absolute top-0 bottom-0 w-1 bg-blue-500 rounded-md left-0"></div>
                  <div className="flex">
                    <div key={objective.id} className="w-full">
                      <p className="mb-0.5 font-bold">
                        {objective.objective.title}
                      </p>
                      <div className="flex mb-0.5 justify-between items-center">
                        <p className="text-xs text-slate-500">
                          {objective.is_completed ? "100%" : "0%"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {objective.is_completed
                            ? "Completed"
                            : "Not Completed"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          ) : null
        )
      ) : (
        <div className="border-2 border-dashed border-slate-200 text-slate-500 text-sm py-6 text-center">
          There are no objectives posted
        </div>
      )}
    </div>
  );
};

export default Objective;
