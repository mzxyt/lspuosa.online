import { Button, Card, Label, Textarea, ToggleSwitch } from "flowbite-react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { UsersIcon } from "lucide-react";
import TextInput from "@/Components/TextInput";

function OPCRCreate({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        isQRequired: false,
        isERequired: false,
        isTRequired: false,
        title: "",
        targetIndicator: "",
        supportingDocuments: "",
        individualsAccountable: "",
        remarks: "",
    });

    const [isQRequired, setIsQRequired] = React.useState(false);
    const [isERequired, setIsERequired] = React.useState(false);
    const [isTRequired, setIsTRequired] = React.useState(false);

    // submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // set data
        setData("isQRequired", isQRequired);
        setData("isERequired", isERequired);
        setData("isTRequired", isTRequired);

        // submit form
        post("/opcrquestion");
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Announcements
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="sm:rounded-lg flex justify-center">
                        <Card className="max-w-[30rem] w-[90%]">
                            <div className="flex items-center">
                                <UsersIcon size={48} />
                                <h1 className="ml-5 font-bold text-[1.5rem]">
                                    Create OPCR Question
                                </h1>
                            </div>
                            <div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col w-full"
                                >
                                    <div className="flex flex-col w-full -mx-3 mb-6">
                                        <div className="w-full flex flex-col m-3">
                                            <Label
                                                forinput="title"
                                                value="Title ( MFO/PAP )"
                                            />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                autoFocus
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col w-full m-3">
                                            <Label
                                                forinput="targetIndicator"
                                                value="Target Indicator"
                                            />
                                            <Textarea
                                                id="targetIndicator"
                                                type="text"
                                                className="mt-1 block w-full h-[10rem]"
                                                value={data.targetIndicator}
                                                onChange={(e) =>
                                                    setData(
                                                        "targetIndicator",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                autoFocus
                                            />
                                            {errors.targetIndicator && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.targetIndicator}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col w-full m-3">
                                            <Label
                                                forinput="individualsAccountable"
                                                value="Individuals Accountable"
                                            />
                                            <Textarea
                                                id="individualsAccountable"
                                                type="text"
                                                className="mt-1 block w-full h-[10rem]"
                                                value={
                                                    data.individualsAccountable
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "individualsAccountable",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                autoFocus
                                            />
                                            {errors.individualsAccountable && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors.individualsAccountable
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col w-full m-3">
                                            <Label
                                                forinput="supportingDocuments"
                                                value="Supporting Documents"
                                            />
                                            <Textarea
                                                id="supportingDocuments"
                                                type="text"
                                                className="mt-1 block w-full h-[10rem]"
                                                value={data.supportingDocuments}
                                                onChange={(e) =>
                                                    setData(
                                                        "supportingDocuments",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                autoFocus
                                            />
                                            {errors.supportingDocuments && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.supportingDocuments}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col w-full m-3">
                                            <Label
                                                forinput="remarks"
                                                value="Remarks"
                                            />
                                            <Textarea
                                                id="remarks"
                                                type="text"
                                                className="mt-1 block w-full h-[10rem]"
                                                value={data.remarks}
                                                onChange={(e) =>
                                                    setData(
                                                        "remarks",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                autoFocus
                                            />
                                            {errors.remarks && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.remarks}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex">
                                            {/* toggle box */}

                                            <div>
                                                <ToggleSwitch
                                                    id="isQRequired"
                                                    className="m-3"
                                                    checked={isQRequired}
                                                    label="Q"
                                                    onChange={() => {
                                                        setIsQRequired(
                                                            !isQRequired
                                                        );

                                                        setData(
                                                            "isQRequired",
                                                            !isQRequired
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <ToggleSwitch
                                                    id="isERequired"
                                                    className="m-3"
                                                    checked={isERequired}
                                                    label="E"
                                                    onChange={() => {
                                                        setIsERequired(
                                                            !isERequired
                                                        );

                                                        setData(
                                                            "isERequired",
                                                            !isERequired
                                                        );
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <ToggleSwitch
                                                    id="isTRequired"
                                                    className="m-3"
                                                    checked={isTRequired}
                                                    label="T"
                                                    onChange={() => {
                                                        setIsTRequired(
                                                            !isTRequired
                                                        );

                                                        setData(
                                                            "isTRequired",
                                                            !isTRequired
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* submit */}
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            className="bg-orange-600 btn"
                                            disabled={processing}
                                        >
                                            Create Question
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default OPCRCreate;
