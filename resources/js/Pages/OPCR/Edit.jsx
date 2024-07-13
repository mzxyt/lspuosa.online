import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Button, Card, Label, Select, Textarea } from "flowbite-react";
import { CpuIcon, GanttChartSquare } from "lucide-react";
import TextInput from "@/Components/TextInput";
import { toast } from "react-toastify";

function QuestionCard({ questionData, index, onChange, data }) {
    const handleChange = (field, value) => {
        const updatedData = { ...data };
        updatedData[field] = value;

        // Check if Q, E, and T are not null before including them in the average calculation
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
            updatedData.a = avg.toFixed(1); // Round to 1 decimal place
        } else {
            updatedData.a = ""; // Reset A if all of Q, E, and T are null or empty
        }

        onChange(index, updatedData);
    };

    return (
        <Card className="m-3 mt-5 flex flex-col max-w-md w-[100%]">
            <div className="flex items-center">
                <div className="w-[2rem] h-[2rem]">
                    <CpuIcon />
                </div>
                <h2 className=" whitespace-pre-wrap ml-3 text-lg font-bold">
                    {questionData.title}
                </h2>
            </div>

            <div className="h-[50%]">
                <h2 className="font-bold mb-2">Target Indicators</h2>
                <p className="whitespace-pre-wrap">
                    {questionData.targetIndicators}
                </p>
            </div>

            <div className="h-[50%]">
                <h2 className="font-bold mb-2">Remarks</h2>
                <p className="whitespace-pre-wrap">{questionData.remarks}</p>
            </div>

            <div className="w-full flex">
                {/* Q,E,T,A Input */}
                <div className="flex flex-col justify-center">
                    <Label className="text-center font-bold">Q</Label>
                    <TextInput
                        className={
                            "max-w-[4rem] w-[90%] m-1 " +
                            (data.q == null ? "opacity-50" : "opaciy-100")
                        } // change opacity to 50% if disabled
                        onChange={(e) => {
                            if (e.target.value) {
                                handleChange("q", e.target.value);
                            } else {
                                handleChange("q", "");
                            }
                        }}
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
                            (data.e == null ? "opacity-50" : "opaciy-100")
                        }
                        onChange={(e) => {
                            if (e.target.value) {
                                handleChange("e", e.target.value);
                            } else {
                                handleChange("e", "");
                            }
                        }}
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
                            (data.t == null ? "opacity-50" : "opaciy-100")
                        }
                        onChange={(e) => {
                            if (e.target.value) {
                                handleChange("t", e.target.value);
                            } else {
                                handleChange("t", "");
                            }
                        }}
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
                        className="max-w-[4rem] opacity-50 w-[90%] m-1"
                        label="A"
                        value={data.a}
                        required
                    />
                </div>
            </div>

            <div>
                {/* remarks */}
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
                {/* remarks */}
                <Label className="font-bold">Alloted Budgets</Label>
                <Textarea
                    onChange={(e) =>
                        handleChange("alloted_budgets", e.target.value)
                    }
                    className="w-full h-[8rem]"
                    value={data.alloted_budgets}
                />
            </div>
        </Card>
    );
}

function Edit({ auth, teachers, opcr, questions }) {
    const Information = [
        // {
        //     title: "1.1 Strengthen the Retention Policy as per the University Student Manual",
        //     targetIndicators:
        //         "Developed an intervention programs for the improvement of the students' academic performance are conducted during the middle of the semester",
        //     individuals_accountable:
        //         "College Dean, College Secretary, Program Chair",
        //     remarks:
        //         "Quality: \n 5 - No Corrections \n 4 - With 1-2 corrections \n 3 - With exactly 3 corrections \n 2 - With no more than 4-5 corrections \n 1 - With more than 5 corrections \n Timeliness: \n 5 - Submitted action plan for 5 or more working days before the deadline \n 4 - Submitted action plan 1 to 4 working days before the deadline \n 3 - Submitted action plan Within the deadline \n 2 - Submitted action plan a day before the deadline \n 1 - Submitted action plan 2 or more days after the deadline.",
        //     supporting_documents: "Proof of Implementation",
        // },
    ];

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

    // Initialize the form data based on the number of questions
    for (let i = 0; i < opcr.qeta.length; i++) {
        initialFormData.push({
            q: opcr.qeta[i].q,
            e: opcr.qeta[i].e,
            t: opcr.qeta[i].t,
            a: opcr.qeta[i].a,
            actual_accomplishments: opcr.qeta[i].actual_accomplishments,
            alloted_budgets: opcr.qeta[i].alloted_budgets,
            additionalInfo: Information[i],
        });
    }

    const [formData, setFormData] = useState(initialFormData);

    const handleQuestionChange = (questionIndex, updatedData) => {
        console.log(updatedData);
        const updatedFormData = [...formData];
        updatedFormData[questionIndex] = updatedData;
        setFormData(updatedFormData);
        setData({
            evaluatee: opcr.teacher_id,
            evaluator: opcr.user_id,
            formData: updatedFormData,
            comments: opcr.comments,
            from: from,
            to: to,
        });

        console.log(formData);
    };

    const [to, setTo] = useState(opcr.to);
    const [from, setFrom] = useState(opcr.from);

    const handleFromDateChange = (e) => {
        const fromDate = e.target.value;
        setFrom(fromDate);

        if (fromDate !== "") {
            const date = new Date(fromDate);
            date.setMonth(date.getMonth() + 5);
            const toDate = date.toISOString().split("T")[0];
            setTo(toDate);
            setData({
                evaluatee: opcr.teacher_id,
                evaluator: opcr.user_id,
                formData: formData,
                comments: data.comments,
                from: fromDate,
                to: toDate,
            });
        } else {
            setTo(""); // Reset "To" if "From" is empty
        }
    };

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

    const { data, setData, put, processing, errors, reset } = useForm({
        evaluatee: opcr.user_id,
        evaluator: opcr.user_id,
        formData: formData,
        comments: opcr.comments,
        from: from,
        to: to,
    });

    const submit = (e) => {
        e.preventDefault();
        // Use the Inertia.put method to update the form
        put(`/opcr/${opcr.id}`);
    };

    console.log(opcr);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Announcements
                </h2>
            }
        >
            <Head title="OPCR Edit" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <Card className="">
                            <div className="flex items-center">
                                <GanttChartSquare className="w-10 h-10" />
                                <h1 className="ml-3 text-2xl font-bold">
                                    Evaluate User
                                </h1>
                            </div>
                            <form onSubmit={submit} className="flex flex-col">
                                <div className="flex flex-col mt-3 ml-3 w-full">
                                    {/* date, from - to, label : IPCR date range  */}
                                    <Label className="font-bold mb-2">
                                        Date Range
                                    </Label>
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
                                {/* Add any additional form fields here */}
                                <div className="flex flex-wrap">
                                    {formData.map((questionData, index) => (
                                        <QuestionCard
                                            key={index}
                                            questionData={
                                                questionData.additionalInfo
                                            }
                                            index={index}
                                            data={formData[index]}
                                            onChange={handleQuestionChange}
                                        />
                                    ))}
                                </div>

                                <div>
                                    <Card className="m-3">
                                        <div className="flex flex-wrap">
                                            <div className="flex justify-center">
                                                <Card className="m-2 p-5 sm:w-full">
                                                    <h1 className="text-center">
                                                        Total Average
                                                    </h1>
                                                    <p className="text-[3rem] text-center">
                                                        {formData.every(
                                                            (question) =>
                                                                question.a !==
                                                                ""
                                                        )
                                                            ? (
                                                                  formData.reduce(
                                                                      (a, b) =>
                                                                          a +
                                                                          parseFloat(
                                                                              b.a
                                                                          ),
                                                                      0
                                                                  ) /
                                                                  formData.length
                                                              ).toFixed(1)
                                                            : "0"}
                                                    </p>
                                                </Card>
                                            </div>
                                            <Card className="m-2">
                                                <Label className="font-bold">
                                                    Comments and Recommendations
                                                    for Development Purposes
                                                </Label>
                                                <Textarea
                                                    onChange={(e) =>
                                                        setData({
                                                            evaluatee:
                                                                opcr.teacher_id,
                                                            evaluator:
                                                                opcr.user_id,
                                                            formData: formData,
                                                            comments:
                                                                e.target.value,
                                                            from: from,
                                                            to: to,
                                                        })
                                                    }
                                                    className="w-full h-[8rem]"
                                                    defaultValue={opcr.comments}
                                                />
                                            </Card>
                                        </div>
                                    </Card>
                                </div>

                                {/* submit */}
                                <div className="m-3">
                                    <Button
                                        type="submit"
                                        className="bg-red-500"
                                    >
                                        Edit Evaluation
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Edit;
