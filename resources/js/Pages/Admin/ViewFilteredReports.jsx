import ElegantNav from '@/Components/ElegantNav'
import HeaderTitle from '@/Components/HeaderTitle'
import CustomSelectDropdown from '@/Components/SignInDropdownButton'
import TextProfilePic from '@/Components/TextProfilePic'
import UnitHeadReportCard from '@/Components/UnitHeadReportCard'
import PanelLayout from '@/Layouts/PanelLayout'
import { Link, router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Image, ListGroup, ListGroupItem, Placeholder, Row, Spinner } from 'react-bootstrap'
import DataTable from 'react-data-table-component'

const ViewFilteredReports = ({ designation, campus, submissionBins }) => {
    const { auth } = usePage().props;
    const [reports, setReports] = useState([]);
    const [fetchingReports, setFetchingReports] = useState(false)
    const [fetchingUnitHeads, setFetchingUnitHeads] = useState(true)
    const [unitHeads, setUnitHeads] = useState([])
    const [selectedUnitHead, setSelectedUnitHead] = useState(null)
    const [submissionBin, setSubmissionBin] = useState(submissionBins.length > 0 ? submissionBins[0] : null);

    const tableColumns = [
        {
            name: "Unit Head",
            selector: row => row.unit_head.firstname + " " + row.unit_head.lastname,
        },

    ];
    const fetchReports = async () => {
        setFetchingReports(true)
        var reports = {};

        if (auth.role === 'admin') {
            reports = await axios.get(route('reports.all.index', [campus.id, submissionBin.id, selectedUnitHead.id]));
        } else {
            // if superadmin only get reports that were approved
            reports = await axios.get(route('reports.approved.index', [campus.id, submissionBin.id, selectedUnitHead.id]));
        }
        console.log('reports: ', reports)

        setReports(reports?.data?.reports || [])
        setFetchingReports(false)
    }

    useEffect(() => {
        const getUnitHeads = async () => {
            setFetchingUnitHeads(true)
            let unitHeads = await axios.get(route('reports.designation.unit_heads.index', [campus.id, designation.id]));
            setUnitHeads(unitHeads.data.unitHeads)
            if (unitHeads.data.unitHeads.length > 0 && selectedUnitHead == null) {
                setSelectedUnitHead(unitHeads.data.unitHeads[0])
            }
            setFetchingUnitHeads(false)
        }

        getUnitHeads();
    }, [])

    useEffect(() => {
        if (selectedUnitHead) {
            fetchReports();
        }
    }, [selectedUnitHead, submissionBin]);


    const openReport = (report) => {
        router.visit(route('admin.report.open', { report_id: report.id }))
    }

    const onSelect = (item) => {
        let id = item.value
        console.log(id)
        for (let bin of submissionBins) {
            if (bin.id == id) {
                setSubmissionBin(bin);
            }
        }
    }

    return (
        <PanelLayout
            pageTitle='View Reports'
            defaultActiveLink={`submission_bin.reports.${campus.id}.${designation.id}`}
            headerTitle={(
                <HeaderTitle backButton text='Unit Head Report' />
            )}
        >

            <div className="content-wrapper">
                {
                    submissionBins.length > 0 ? (
                        <>
                            <Card className='border-0 shadow-sm rounded-0 mb-2'>
                                <Card.Body>
                                    <p className='fw-bold'>Select submission bin</p>
                                    <div className="w-100">
                                        <CustomSelectDropdown
                                            selected={{ value: submissionBin?.id, text: submissionBin?.title }}
                                            handleSelect={onSelect}
                                            size='sm'
                                            rounded
                                            textAlign='start'
                                            className={'my-0'}
                                            menu={submissionBins.map((item) => ({ value: item.id, text: item.title }))}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className='border-0 shadow-sm rounded-0 mb-2'>
                                <Card.Body>
                                    <p className='flex items-center text-lg my-0'>
                                        <i className='fi fi-rr-box me-2'></i>
                                        {submissionBin?.title}
                                    </p>
                                    <div className="text-secondary">
                                        {
                                            submissionBin?.deadline_date ? (
                                                <p className="text-sm mt-3 mb-0">
                                                    Due {format(new Date(submissionBin?.deadline_date), 'MMM d, Y / hh:mm aaa')}
                                                </p>
                                            ) : (
                                                <p className='mt-3 mb-0 text-sm'>
                                                    No deadline.
                                                </p>
                                            )
                                        }
                                    </div>
                                    <hr />

                                    {
                                        submissionBin?.instruction ? (
                                            <>
                                                <p className='text-sm text-secondary my-1'>
                                                    {submissionBin?.instruction}
                                                </p>
                                            </>
                                        ) : (
                                            <p className='text-sm text-black-50 my-1'>
                                                No instruction.
                                            </p>
                                        )
                                    }
                                </Card.Body>
                            </Card>
                        </>
                    ) : (
                        <Card className='border-0 shadow-sm rounded-0 mb-3'>
                            <Card.Body>
                                <p className='fw-bold'>No Submission bin found.</p>
                                <Link href={route('admin.create_submission_bin')}>
                                    Create Now
                                </Link>
                            </Card.Body>
                        </Card>
                    )
                }
                <Card className='border-0 shadow-sm rounded-0'>
                    <Card.Body className='p-lg-4 p-4'>
                        <div className="">
                            <Row className='gy-3'>
                                <Col className='order-1 order-lg-0'>
                                    <p className='fw-bolder mb-0 fs-5'>
                                        {campus.name} Campus
                                    </p>
                                    <p className='mt-2 text-secondary fw-bold'>
                                        <span>
                                            Unit Head Reports / {designation.classification.name} / {designation.name}
                                        </span>
                                    </p>
                                    <Row>
                                        {
                                            fetchingReports ? (
                                                <>
                                                    <Col lg={3}>
                                                        <Placeholder animation='wave'>
                                                            <div className='bg-light w-100 h-[180px]'></div>
                                                        </Placeholder>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <Placeholder animation='wave'>
                                                            <div className='bg-light w-100 h-[180px]'></div>
                                                        </Placeholder>
                                                    </Col>

                                                </>
                                            ) : (
                                                reports.length > 0 ? (
                                                    reports.map((report, index) => (
                                                        <Col xl={3} lg={4} md={6} sm={6} xs={6} key={index}>
                                                            <UnitHeadReportCard handleClick={() => openReport(report)} data={report} />
                                                        </Col>
                                                    ))
                                                ) : (
                                                    <p className='text-sm text-secondary'>Nothing to show.</p>
                                                )
                                            )
                                        }
                                    </Row>
                                </Col>
                                <Col lg={3} className='order-0 order-lg-1'>
                                    <p className='text-sm fw-bold'>Unit Heads</p>
                                    <p className='mt-0 text-sm mb-0'></p>
                                    {
                                        fetchingUnitHeads ? (
                                            <>
                                                <Placeholder animation='wave'>
                                                    <Placeholder bg='light' xs={12} />
                                                </Placeholder>
                                                <Placeholder animation='wave'>
                                                    <Placeholder bg='light' xs={12} />
                                                </Placeholder>
                                                <Placeholder animation='wave'>
                                                    <Placeholder bg='light' xs={12} />
                                                </Placeholder>
                                            </>

                                        ) : (
                                            unitHeads.length > 0 ? (
                                                <>
                                                    {
                                                        unitHeads.map((unitHead, index) => (
                                                            <div key={index} className='text-sm px-0 w-max mb-3'>
                                                                <div
                                                                    onClick={() => setSelectedUnitHead(unitHead)}
                                                                    className={`flex gap-3 items-center py-2 px-2 rounded-pill cursor-pointer ${unitHead.id == selectedUnitHead?.id ? 'bg-light-primary' : ''}`}
                                                                >
                                                                    {
                                                                        unitHead.image ? (
                                                                            <Image
                                                                                src={unitHead.image}
                                                                                width={30}
                                                                                height={30}
                                                                                roundedCircle
                                                                            />
                                                                        ) : (
                                                                            <TextProfilePic size='sm' text={`${unitHead.firstname[0]}`} bg='light' className="text-primary fw-bold" />
                                                                        )
                                                                    }
                                                                    <p className="my-0">
                                                                        {unitHead.firstname} {unitHead.lastname}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                </>
                                            ) : (
                                                <p className='text-sm text-secondary'>Nothing to show.</p>
                                            )
                                        )
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </PanelLayout >
    )
}

export default ViewFilteredReports
