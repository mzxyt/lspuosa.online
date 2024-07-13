import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button, Card, Label, Select, Textarea } from "flowbite-react";
import { CpuIcon, GanttChartSquare } from "lucide-react";
import TextInput from "@/Components/TextInput";
import { toast } from "react-toastify";
import PanelLayout, { LayoutType } from "@/Layouts/PanelLayout";

function QuestionCard({ questionData, index, onChange, data }) {
  const handleChange = (field, value) => {
    const updatedData = { ...data };
    updatedData[field] = value;

    const validValues = ["q", "e", "t"];
    const nonNullValues = validValues.filter(
      (key) => updatedData[key] !== null && updatedData[key] !== ""
    );

    if (nonNullValues.length > 0) {
      const avg =
        nonNullValues.reduce(
          (sum, key) => sum + parseFloat(updatedData[key]),
          0
        ) / nonNullValues.length;
      updatedData.a = avg.toFixed(1);
    } else {
      updatedData.a = "";
    }

    onChange(index, updatedData);
  };

  return (
    <Card className="m-3 mt-5 flex flex-col max-w-md w-[100%]">
      <div className="flex items-center">
        <div className="w-[2rem] h-[2rem]">
          <CpuIcon />
        </div>
        <h2 className="whitespace-pre-wrap ml-3 text-lg font-bold">
          {questionData.title}
        </h2>
      </div>

      <div className="h-[50%]">
        <h2 className="font-bold mb-2">Target Indicators</h2>
        <p className="whitespace-pre-wrap">{questionData.targetIndicators}</p>
      </div>

      <div className="h-[50%]">
        <h2 className="font-bold mb-2">Remarks</h2>
        <p className="whitespace-pre-wrap">{questionData.remarks}</p>
      </div>

      <div className="w-full flex">
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">Q</Label>
          <TextInput
            className={
              "max-w-[4rem] w-[90%] m-1 " +
              (data.q == null ? "border-red-500" : "opaciy-100")
            }
            onChange={(e) => handleChange("q", e.target.value)}
            label="Q"
            required={data.q == null ? false : true}
            value={data.q}
            disabled={data.q == null}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">E</Label>
          <TextInput
            className={
              "max-w-[4rem] w-[90%] m-1 " +
              (data.e == null ? "border-red-500" : "opacity-100")
            }
            onChange={(e) => handleChange("e", e.target.value)}
            label="E"
            required={data.e == null ? false : true}
            value={data.e}
            disabled={data.e == null}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">T</Label>
          <TextInput
            className={
              "max-w-[4rem] w-[90%] m-1 " +
              (data.t == null ? "border-red-500" : "opacity-100")
            }
            onChange={(e) => handleChange("t", e.target.value)}
            label="T"
            value={data.t}
            required={data.t == null ? false : true}
            disabled={data.t == null}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="text-center font-bold">A</Label>
          <TextInput
            disabled
            className="max-w-[4rem] opacity-70 border-orange-500 w-[90%] m-1"
            label="A"
            value={data.a}
            required
          />
        </div>
      </div>

      <div>
        <Label className="font-bold">Actual Accomplishments</Label>
        <Textarea
          onChange={(e) =>
            handleChange("actual_accomplishments", e.target.value)
          }
          className="w-full h-[8rem]"
          value={data.actual_accomplishments}
        />
      </div>
      <div>
        <Label className="font-bold">Allotted Budgets</Label>
        <Textarea
          onChange={(e) => handleChange("alloted_budgets", e.target.value)}
          className="w-full h-[8rem]"
          value={data.alloted_budgets}
        />
      </div>
    </Card>
  );
}

function Create({ auth, teachers, questions }) {
  const Information = [];
  for (let i = 0; i < questions.length; i++) {
    Information.push({
      title: questions[i].title,
      targetIndicators: questions[i].target_indicators,
      remarks: questions[i].remarks,
      supportingDocuments: questions[i].supporting_documents,
      individualsAccountable: questions[i].individuals_accountable,
    });
  }

  const initialFormData = [];
  for (let i = 0; i < Information.length; i++) {
    initialFormData.push({
      q: questions[i].isQRequired == 1 ? "" : null,
      e: questions[i].isERequired == 1 ? "" : null,
      t: questions[i].isTRequired == 1 ? "" : null,
      a: "",
      actual_accomplishments: "",
      alloted_budgets: "",
      additionalInfo: Information[i],
      id: questions[i].id,
    });
  }

  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [comments, setComments] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const handleToDateChange = (e) => {
    setTo(e.target.value);
    setData({
      evaluatee: evaluatee,
      evaluator: auth.user.id,
      formData: formData,
      comments: comments,
      from: from,
      to: e.target.value,
    });
  };

  const handleNextPage = () => {
    const startIndex = currentPage * cardsPerPage;
    const endIndex = (currentPage + 1) * cardsPerPage;

    // Check if any of the required fields (q, e, t) is blank in the current page's questions
    const isAnyFieldEmpty = formData
      .slice(startIndex, endIndex)
      .some((question) => {
        return Object.values(question).some((value) => value === "");
      });

    if (isAnyFieldEmpty) {
      toast.error("Please fill out all the fields before proceeding");
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const cardsPerPage = 4;

  const totalPages = Math.ceil(questions.length / cardsPerPage);

  const handleFromDateChange = (e) => {
    const fromDate = e.target.value;
    setFrom(fromDate);

    if (fromDate !== "") {
      const date = new Date(fromDate);
      date.setMonth(date.getMonth() + 5);
      const toDate = date.toISOString().split("T")[0];
      setTo(toDate);
      setData({
        evaluatee: auth.user.id,
        evaluator: auth.user.id,
        formData: formData,
        comments: comments,
        from: fromDate,
        to: toDate,
      });
    } else {
      setTo(""); // Reset "To" if "From" is empty
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleQuestionChange = (questionIndex, updatedData) => {
    const updatedFormData = [...formData];
    const dataIndex = currentPage * cardsPerPage + questionIndex;
    updatedFormData[dataIndex] = updatedData;
    setFormData(updatedFormData);
    setData({
      evaluatee: auth.user.id,
      evaluator: auth.user.id,
      formData: updatedFormData,
      comments: comments,
      from: from,
      to: to,
    });
  };
  const { data, setData, post, processing, errors, reset } = useForm({
    evaluatee: auth.user.id,
    evaluator: auth.user.id,
    from: from,
    to: to,
    formData: formData,
    comments: "",
  });

  const submit = (e) => {
    e.preventDefault();
    for (let i = 0; i < data.formData.length; i++) {
      if (
        data.formData[i].q == "" ||
        data.formData[i].e == "" ||
        data.formData[i].t == ""
      ) {
        console.log(data.formData[i] + " this is the data");
        toast.error("Please fill out all the fieldssss before proceeding");
        return;
      }
    }
    post(`/opcr`);
  };

  const { flash } = usePage().props;

  useEffect(() => {
    if (flash.message) {
      toast.success(flash.message);
    }
  }, [flash]);

  return (
    <PanelLayout
      layout={LayoutType.SUPER_ADMIN}
      defaultActiveLink="generated reports annually"
    >
      <Head title="OPCR Create" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden sm:rounded-lg">
            <Card className="">
              <div className="flex items-center">
                <GanttChartSquare className="w-10 h-10" />
                <h1 className="ml-3 text-2xl font-bold">Evaluate OPCR</h1>
              </div>
              <form onSubmit={submit} className="flex flex-col">
                <div className="flex flex-col ml-3 w-full">
                  <Label className="font-bold mb-2">Evaluatee</Label>
                  <Select className="w-[30%]" disabled>
                    <option value={auth.user.id}>
                      {auth.user.firstname} {auth.user.lastname}
                    </option>
                  </Select>
                </div>
                <div className="flex flex-col mt-3 ml-3 w-full">
                  <Label className="font-bold mb-2">Date Range</Label>
                  <div className="flex flex-col sm:flex-row">
                    <TextInput
                      type="date"
                      className="w-[30%]"
                      onChange={handleFromDateChange}
                      label="From"
                      value={from}
                    />
                    <TextInput
                      type="date"
                      className="w-[30%] mx-2"
                      onChange={handleToDateChange}
                      label="To"
                      value={to}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap">
                  {questions
                    .slice(
                      currentPage * cardsPerPage,
                      (currentPage + 1) * cardsPerPage
                    )
                    .map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        questionData={{
                          title: question.title,
                          targetIndicators: question.target_indicators,
                          remarks: question.remarks,
                        }}
                        index={index}
                        data={formData[currentPage * cardsPerPage + index]}
                        onChange={handleQuestionChange}
                      />
                    ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-between m-3">
                  {currentPage > 0 && (
                    <Button onClick={handlePrevPage} className="bg-gray-500">
                      Previous
                    </Button>
                  )}
                  <p className="text-lg font-bold">
                    Question {currentPage + 1} of {totalPages}
                  </p>
                  {currentPage < totalPages - 1 && (
                    <Button onClick={handleNextPage} className="bg-gray-500">
                      Next
                    </Button>
                  )}
                </div>

                {
                  // if final page
                  currentPage === totalPages - 1 && (
                    <div>
                      <div>
                        <Card className="m-3">
                          <div className="flex flex-wrap">
                            <div className="flex justify-center">
                              <Card className="m-2 p-5 sm:w-full">
                                <h1 className="text-center">Total Average</h1>
                                <p className="text-[3rem] text-center">
                                  {formData.every(
                                    (question) => question.a !== ""
                                  )
                                    ? (
                                        formData.reduce(
                                          (a, b) => a + parseFloat(b.a),
                                          0
                                        ) / formData.length
                                      ).toFixed(1)
                                    : "0"}
                                </p>
                              </Card>
                            </div>
                            <Card className="m-2">
                              <Label className="font-bold">
                                Comments and Recommendations for Development
                                Purposes
                              </Label>
                              <Textarea
                                onChange={(e) =>
                                  setData({
                                    evaluatee: auth.user.id,
                                    evaluator: auth.user.id,
                                    formData: formData,
                                    from: from,
                                    to: to,
                                    comments: e.target.value,
                                  })
                                }
                                className="w-full h-[8rem]"
                                value={data.comments}
                              />
                            </Card>
                          </div>
                        </Card>
                      </div>
                      <div className="m-3">
                        <Button type="submit" className="bg-red-500">
                          Submit Evaluation
                        </Button>
                      </div>
                    </div>
                  )
                }
              </form>
            </Card>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}

export default Create;
