import ConfirmModal from '@/Components/ConfirmModal'
import ImageUploader from '@/Components/ImageUploader'
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { Alert, Button, Card, Form, Image } from 'react-bootstrap'

const EditReminder = ({ auth,reminder }) => {
    const [count, setCount] = useState(0)
    const [showUploader, setShowUploader] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const { data, setData, processing, patch } = useForm({
        title: reminder?.title,
        content: reminder?.content,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route('reminders.edit',{id:reminder.id}))
    }



    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} headerTitle="Edit Reminder" defaultActiveLink="reminders">
            
            <ImageUploader closeOnComplete onCompleted={imgUrl => setData('image', imgUrl)} show={showUploader} handleClose={() => setShowUploader(false)} />
            <div className='py-3'>
                <div className="container-fluid">
                    <Card className='border-0 shadow-sm p-3'>
                        <Card.Body>
                            <Form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <Form.Label>Title:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        required
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder='Enter title here...'
                                    />
                                </div>
                                <div className="mb-3">
                                    <Form.Label>Content:</Form.Label>
                                    <textarea value={data.content} className='form-control' onChange={e => setData('content', e.target.value)} rows={3}></textarea>
                                </div>
                                <div className="text-end flex items-center justify-end gap-3 mt-5">
                                    <Link className='link link-secondary text-sm text-decoration-none' href={route('admin.reminders')}>
                                        <i className='fi fi-rr-arrow-back'></i> Cancel
                                    </Link>
                                    <Button className='rounded-1 btn-primary' type='submit'>
                                        <div className="flex justify-center items-center gap-1">
                                            <span className="text-sm">Submit</span>
                                            <i className='bx bx-right-arrow-alt leading-none'></i>
                                        </div>
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    )
}

export default EditReminder