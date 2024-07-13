import TextInput from "@/Components/TextInput";
import { Head } from "@inertiajs/react";
import { Button, Label } from "flowbite-react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function Print({ auth, opcr, questions }) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    console.log(opcr);

    const [reviewed_by, setReviewedBy] = React.useState("Dr. Keno C.");
    const [approved_by, setApprovedBy] = React.useState(
        "DR. ROMEO DC. INASORIA"
    );
    const [final_rating_by, setFinalRatingBy] = React.useState("");
    const [assesed_by, setAssesedBy] = React.useState("DR. ROMEO DC. INASORIA");

    return (
        <div className="flex w-full h-full justify-center items-center flex-col">
            <Head title="OPCR Print" />
            <div className="flex w-full p-5 mb-10">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <Label forInput="approved_by" value="Approved By" />
                    <TextInput
                        id="approved_by"
                        type="text"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            setApprovedBy(e.target.value);
                        }}
                        required
                        autoFocus
                    />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <Label forInput="reviewed_by" value="Reviewed By" />
                    <TextInput
                        id="reviewed_by"
                        type="text"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            setReviewedBy(e.target.value);
                        }}
                        required
                        autoFocus
                    />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <Label forInput="final_rating_by" value="Final Rating By" />
                    <TextInput
                        id="final_rating_by"
                        type="text"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            setFinalRatingBy(e.target.value);
                        }}
                        required
                        autoFocus
                    />
                </div>
                {/* <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <Label
                                forInput="discussed_by"
                                value="Final Rating By"
                            />
                            <TextInput
                                id="discussed_by"
                                type="text"
                                className="mt-1 block w-full"
                                onChange={(e) => {
                                    setDiscussedBy(e.target.value);
                                }}
                                required
                                autoFocus
                            />
                        </div> */}
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <Label forInput="assesed_by" value="Assessed By" />
                    <TextInput
                        id="assessed_by"
                        type="text"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            setAssesedBy(e.target.value);
                        }}
                        required
                        autoFocus
                    />
                </div>
            </div>
            <div
                ref={componentRef}
                className="w-full flex flex-col justify-center items-center"
            >
                <div className="flex justify-center p-4 flex-col items-center">
                    <div className="flex flex-col items-center">
                        <h1 className="font-extrabold text-lg">
                            BULACAN STATE UNIVERSITY
                        </h1>
                        <h2>City of Malolos, Bulacan</h2>
                        <br />
                        <h1 className="font-extrabold text-lg">
                            OFFICE PERFORMANCE COMMITMENT AND REVIEW (OPCR)
                        </h1>
                        <br />
                        <p>
                            I,{" "}
                            <span className="font-bold">
                                {opcr.user.firstname} {opcr.user.lastname}
                            </span>{" "}
                            , Dean of the COLLEGE OF INFORMATION AND
                            COMMUNICATIONS TECHNOLOGY of the Academic Unit,
                            commit to deliver and agree to be rated on the
                            atainment of the following targets in accordance
                            with the indicated measures for the period
                            <span className="font-bold">
                                {" "}
                                {
                                    // format date : must be january 2023
                                    new Date(opcr.from).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                        }
                                    )
                                }
                                {" - "}
                                {
                                    // add 5 months to opcr.created_at and format
                                    new Date(opcr.to).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                        }
                                    )
                                }
                            </span>
                        </p>
                    </div>
                    <div className="flex w-[80%] h-[10rem] flex-col items-end justify-center">
                        <div className="flex flex-col">
                            <br />
                            <br />
                            <p className="text-center underline-offset-4 font-bold underline">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {"              "}
                                {opcr.evaluator.firstname}{" "}
                                {opcr.evaluator.lastname}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </p>
                            <p className="text-center">Ratee</p>
                            <br />
                            <p className="text-start mb-5">
                                Date:{" "}
                                {
                                    // // format date
                                    // new Date(
                                    //     opcr.created_at
                                    // ).toLocaleDateString()
                                    // format data : january 1, 2021
                                    new Date(opcr.from).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <br />
                <table className="tg w-[98%]">
                    <thead>
                        <tr>
                            <th className="tg-0lax">
                                <p className="text-start text-[95%]">
                                    Reviewed By:{" "}
                                </p>
                            </th>
                            <th className="tg-baqh">Date</th>
                            <th className="tg-baqh w-[40rem]">
                                <p className="text-center">Approved By:</p>
                            </th>
                            <th className="tg-nrix">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tg-baqh"></td>
                            <td className="tg-0lax" rowSpan="2">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <p className="text-center">
                                    {
                                        // // format date
                                        // new Date(
                                        //     opcr.created_at
                                        // ).toLocaleDateString()
                                        // format data : january 1, 2021
                                        new Date(opcr.from).toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )
                                    }
                                </p>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td className="tg-0lax" rowSpan="2">
                                <p className="underline text-center font-bold underline-offset-4">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {approved_by}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </p>
                                <p className="text-center">CHANCELLOR</p>
                            </td>
                            <td className="tg-0lax" rowSpan="2">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td className="tg-baqh">
                                <p className="text-center font-bold underline underline-offset-4">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{reviewed_by}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </p>
                                <p>Supervisor</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />

                <table className="tg w-[98%] m-3 border-black">
                    <tr>
                        <th className="tg-0pky" rowSpan="2">
                            MFO/FAP
                        </th>
                        <th className="tg-c3ow" rowSpan="2">
                            <p>SUCCESS INDICATORS</p>

                            <p>(TARGETS + MEASURES)</p>
                        </th>
                        <th className="tg-c3ow" rowSpan="2">
                            <p className="text-center">Alloted Budgets</p>
                            <p className="text-center">Targets</p>
                        </th>
                        <th className="tg-0pky" rowSpan="2">
                            <p className="text-center">Division/Individuals</p>
                            <p className="text-center">Accountable</p>
                        </th>
                        <th className="tg-0pky" rowSpan="2">
                            <p className="text-center">
                                Actual Accomplishments
                            </p>
                        </th>
                        <th className="tg-0pky" colSpan="4">
                            <p className="text-center">Rating</p>
                        </th>
                        <th className="tg-c3ow">
                            <p className="text-center">Remarks</p>
                        </th>
                        <th className="tg-c3ow">
                            <p className="text-center">Summary of Findings</p>
                        </th>
                    </tr>
                    <tr>
                        <th className="tg-0pky">Q</th>
                        <th className="tg-0pky">E</th>
                        <th className="tg-0pky">T</th>
                        <th className="tg-0pky">A</th>
                        <th className="tg-0pky"></th>
                        <th className="tg-0pky"></th>
                    </tr>
                    <tbody>
                        {opcr.qeta.map((qeta) => (
                            <tr key={qeta.id}>
                                <td className="tg-0pky whitespace-pre-line">
                                    <br />
                                    <br />
                                    {qeta.question.title}
                                    <br />
                                    <br />
                                </td>
                                <td className="tg-0pky whitespace-pre-line">
                                    <br />
                                    <br />
                                    {qeta.question.target_indicators}
                                    <br />
                                    <br />
                                </td>
                                <td className="tg-0pky whitespace-pre-line">
                                    {qeta?.alloted_budgets}
                                </td>
                                <td className="tg-0pky whitespace-pre-line">
                                    {qeta.question.individuals_accountable}
                                </td>
                                <td className="tg-0pky ">
                                    {qeta?.actual_accomplishments}
                                </td>
                                <td className="tg-0pky"> {qeta?.q}</td>
                                <td className="tg-0pky"> {qeta?.e}</td>
                                <td className="tg-0pky"> {qeta?.t}</td>
                                <td className="tg-0pky"> {qeta?.a}</td>
                                <td className="tg-0pky">
                                    {qeta.question.remarks}
                                </td>
                                <td className="tg-0pky">
                                    {qeta.question.supporting_documents}
                                </td>
                            </tr>
                        ))}

                        <tr>
                            <td className="tg-0lax" colSpan="2">
                                SUMMARY OF RATING
                            </td>
                            <td className="tg-0lax">
                                <p className="text-center font-bold">Total</p>{" "}
                                <br />{" "}
                            </td>
                            <td className="tg-0lax"></td>
                            <td className="tg-0lax" colSpan="5">
                                Final Numerical Ratings
                            </td>
                            <td className="tg-0lax">Final Adjectival Rating</td>
                            <td className="tg-0lax"></td>
                        </tr>
                        <tr>
                            <td className="tg-0lax" colSpan="2">
                                <p className="text-center font-bold"></p> <br />{" "}
                            </td>
                            <td className="tg-0lax" colSpan="1">
                                <p className="p-1 text-center">
                                    {
                                        // sum of all A in QETA
                                        opcr.qeta.reduce((a, b) => a + b.a, 0)
                                    }
                                </p>
                            </td>
                            <td className="tg-0lax" colSpan="1"></td>
                            <td className="tg-0lax" colSpan="5">
                                <p className="p-1 text-center">
                                    {
                                        // average of all A in QETA
                                        (
                                            opcr.qeta.reduce(
                                                (a, b) => a + b.a,
                                                0
                                            ) / opcr.qeta.length
                                        ).toFixed(2)
                                    }
                                </p>
                            </td>
                            <td className="tg-0lax" colSpan="1">
                                {
                                    // todo
                                }
                            </td>
                            <td className="tg-0lax" colSpan="1">
                                {
                                    // todo
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="tg-0lax" colSpan="11">
                                Comments and Recommendation for Development
                                Purposes: <br />
                                {opcr.comments}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br />
                <br />
                <br />

                <table className="tg w-[98%]">
                    <tr>
                        <th className="tg-0pky"> Discussed With </th>
                        <th className="tg-0pky">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </th>
                        <th className="tg-0pky"> Assessed by </th>
                        <th className="tg-0pky">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </th>
                        <th className="tg-0pky"> Final Rating By </th>
                        <th className="tg-0pky">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </th>
                    </tr>
                    <tbody>
                        <tr>
                            <td className="tg-c3ow" rowspan="5">
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <span>
                                    {opcr.user.firstname} {opcr.user.lastname}
                                </span>
                                <br />
                                Signature over printed name of ratee
                            </td>
                            <td className="tg-0pky" rowspan="5"></td>
                            <td className="tg-c3ow" rowspan="5">
                                I certify that i discussed my assessment of the
                                performance
                                <br />
                                with the employee
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <span>{assesed_by}</span>
                                <br />
                                DEAN,CICT
                            </td>
                            <td className="tg-0pky" rowspan="5"></td>
                            <td className="tg-c3ow" rowspan="5">
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <span>{final_rating_by}</span>
                                <br />
                                CHANCELOR
                            </td>
                            <td className="tg-0pky" rowspan="5"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />

            <Button onClick={handlePrint}>Print</Button>
        </div>
    );
}

export default Print;
