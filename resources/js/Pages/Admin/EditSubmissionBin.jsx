import CardComponent from '@/Components/CardComponent'
import PanelLayout from '@/Layouts/PanelLayout'
import { Link, useForm } from '@inertiajs/react'
import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'

const EditSubmissionBin = ({ submissionBin }) => {
    const { patch, processing, data, setData } = useForm({
        title: submissionBin.title,
        instruction: submissionBin.instruction,
        deadline_date: submissionBin.deadline_date,
        deadline_time: submissionBin.deadline_time,
    })

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route('submission_bins.update', { id: submissionBin.id }))
    }

    return (
        <PanelLayout headerTitle="Edit Submission Bin">
            <div className="content-wrapper">
                <CardComponent>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <p className='flex items-center gap-2 mb-3 me-auto fw-bolder'>
                                <i className='fi fi-rr-box'></i>
                                <span>Edit Submission Bin</span>
                            </p>
                            <div className="mb-3">
                                <Form.Label>Title:</Form.Label>
                                <Form.Control
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    type='text'
                                />
                            </div>
                            <div className="mb-3">
                                <Form.Label>Instruction:</Form.Label>
                                <textarea className='form-control' rows={8} value={data.instruction} onChange={e => setData('instruction', e.target.value)} />
                            </div>
                            <hr />
                            <div className="mb-3">
                                <p className='fw-bold mb-2'>Deadline of submission</p>
                                <div className="row">
                                    <div className="col-md">
                                        <Form.Label>Date:</Form.Label>
                                        <Form.Control
                                            type='date'
                                            value={data.deadline_date}
                                            onChange={e => setData('deadline_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md">
                                        <Form.Label>Time:</Form.Label>
                                        <Form.Control
                                            type='time'
                                            value={data.deadline_time}
                                            onChange={e => setData('deadline_time', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mt-5 justify-end flex-wrap gap-2">
                                <div className='flex gap-2'>
                                    <Link disabled={processing} href={route('admin.submission_bins')} className="btn btn-sm btn-secondary">
                                        Cancel
                                    </Link>
                                    <Button disabled={processing} variant='primary' size='sm' type='submit'>
                                        Submit <i className=' bx bx-right-arrow-alt'></i>
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </CardComponent>
            </div>
        </PanelLayout>
    )
}

export default EditSubmissionBin
