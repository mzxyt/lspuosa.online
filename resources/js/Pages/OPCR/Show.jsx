import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import { CpuIcon, GanttChartSquare } from "lucide-react";

function QuestionCard({ questionData, index }) {
    console.log(questionData);
    return (
        <Card className="m-3 mt-5 flex flex-col max-w-md w-[100%]">
            <div className="flex items-center">
                <div className="w-[2rem] h-[2rem]">
                    <CpuIcon />
                </div>
                <h2 className="ml-3 text-lg font-bold">{questionData.title}</h2>
            </div>

            <div className="h-[50%]">
                <h2 className="font-bold mb-2">Target Indicators</h2>
                <p>{questionData.targetIndicators}</p>
            </div>

            <div className="h-[50%]">
                <h2 className="font-bold mb-2">Remarks</h2>
                <p>{questionData.remarks}</p>
            </div>

            <div className="w-full flex">
                {/* Q,E,T,A Input */}
                {["q", "e", "t", "a"].map((field) =>
                    // check if field is a because a is average of q,e,t
                    field === "a" ? (
                        // if field is a, then compute for average
                        <div
                            className="flex flex-col justify-center"
                            key={field}
                        >
                            <Label className="text-center font-bold">
                                {field.toUpperCase()}
                            </Label>
                            <TextInput
                                disabled
                                defaultValue={(index.q + index.e + index.t) / 3}
                                className="max-w-[4rem] w-[90%] m-1"
                                label={field.toUpperCase()}
                            />
                        </div>
                    ) : (
                        <div
                            className="flex flex-col justify-center"
                            key={field}
                        >
                            <Label className="text-center font-bold">
                                {field.toUpperCase()}
                            </Label>
                            <TextInput
                                disabled
                                value={index[field]}
                                className="max-w-[4rem] w-[90%] m-1"
                                label={field.toUpperCase()}
                            />
                        </div>
                    )
                )}
            </div>

            <div>
                {/* remarks */}
                <Label className="font-bold">Actual Accomplishments</Label>
                <Textarea
                    disabled
                    defaultValue={index.actual_accomplishments}
                    className="w-full h-[8rem]"
                ></Textarea>
            </div>
            <div>
                {/* remarks */}
                <Label className="font-bold">Alloted Budgets</Label>
                <Textarea
                    disabled
                    defaultValue={index.alloted_budgets}
                    className="w-full h-[8rem]"
                ></Textarea>
            </div>
        </Card>
    );
}

function Show({ auth, opcr, questions }) {
    // put opcr in data
    const data = opcr.qetas;

    opcr.from = new Date(opcr.from).toISOString().split("T")[0];
    opcr.to = new Date(opcr.to).toISOString().split("T")[0];

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Announcements
                </h2>
            }
        >
            <Head title="OPCR Show" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        <Card className="">
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <GanttChartSquare className="w-10 h-10" />
                                    <h1 className="ml-3 text-2xl font-bold">
                                        {opcr.user.firstname}{" "}
                                        {opcr.user.middlename}{" "}
                                        {opcr.user.lastname}'s Evaluation{" "}
                                    </h1>
                                </div>

                                <h2 className="ml-3 p-3 text-xl font-bold">
                                    Evaluated By: {opcr.evaluator.firstname}{" "}
                                    {opcr.evaluator.middle}{" "}
                                    {opcr.evaluator.lastname}
                                </h2>
                                <br />
                                <div className="flex">
                                    <Button
                                        className="ml-3 bg-orange-500"
                                        onClick={() =>
                                            router.visit(
                                                `/opcr/${opcr.id}/print`
                                            )
                                        }
                                    >
                                        Print opcr
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-col mt-3 ml-3 w-full">
                                    {/* date, from - to, label : IPCR date range  */}
                                    <Label className="font-bold mb-2">
                                        Date Range
                                    </Label>
                                    <div className="flex flex-col sm:flex-row">
                                        <TextInput
                                            type="date"
                                            className="w-[30%]"
                                            disabled
                                            label="From"
                                            value={opcr.from}
                                        />
                                        <TextInput
                                            type="date"
                                            className="w-[30%] mx-2"
                                            disabled
                                            label="To"
                                            value={opcr.to}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap">
                                    {data.map((data, index) => (
                                        <QuestionCard
                                            key={index}
                                            questionData={Information[index]}
                                            index={data}
                                        />
                                    ))}
                                </div>
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
                                                    {/* total average but check first if all 'A' is set*/}
                                                    {data.every(
                                                        (item) => item.a !== 0
                                                    )
                                                        ? (
                                                              data.reduce(
                                                                  (a, b) =>
                                                                      a + b.a,
                                                                  0
                                                              ) / data.length
                                                          ).toFixed(2)
                                                        : "Incomplete"}
                                                </p>
                                            </Card>
                                        </div>
                                        <Card className="m-2">
                                            {/* Textinput and Label here for Comments and Recommendations for Development Purposes */}
                                            <Label className="font-bold">
                                                Comments and Recommendations for
                                                Development Purposes
                                            </Label>
                                            <Textarea
                                                disabled
                                                className="w-full h-[8rem]"
                                                value={opcr.comments}
                                            />
                                        </Card>
                                    </div>
                                </Card>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Show;
