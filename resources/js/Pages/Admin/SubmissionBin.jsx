import CommentsView from '@/Components/CommentsView'
import HeaderTitle from '@/Components/HeaderTitle'
import { formatDate } from '@/Components/Helper'
import PanelLayout from '@/Layouts/PanelLayout'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import React from 'react'
import { Button, Card } from 'react-bootstrap'

const SubmissionBin = ({ submissionBin, auth }) => {
    return (
        <PanelLayout headerTitle={(
            <HeaderTitle text="Submission Bin" backButton />
        )} defaultActiveLink={"submission-bins"}>
            <div className="py-3 px-[1.5rem]">
                <Card className='mb-3 border-0 shadow-sm rounded-0'>
                    <Card.Body>
                        <p className='flex items-center text-lg my-0'>
                            <i className='fi fi-rr-box me-2'></i>
                            {submissionBin.title}
                        </p>
                        <div className="text-secondary">
                            {
                                submissionBin.deadline_date ? (
                                    <p className="text-sm mt-3 mb-0">
                                        Due {formatDate(new Date(submissionBin.deadline_date))}
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
                            submissionBin.instruction ? (
                                <>
                                    <p className='text-sm text-secondary my-1'>
                                        {submissionBin.instruction}
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
                <hr />
                {
                    submissionBin.instruction || submissionBin.instruction != '' ? (
                        <p className='text-sm text-secondary'>{submissionBin.instruction}</p>
                    ) : (
                        <p className='text-sm text-secondary'>No instruction</p>
                    )
                }
                <Button as={Link} size='sm' href={route('admin.reports.view', { submission_bin_id: submissionBin.id })}>View Reports</Button>
            </div>
        </PanelLayout>
    )
}

export default SubmissionBin
