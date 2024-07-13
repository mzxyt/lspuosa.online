import ImageUploader from '@/Components/ImageUploader'
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { Alert, Button, Card, Form, Image } from 'react-bootstrap'

const CreateReminder = ({ auth }) => {
    const [count, setCount] = useState(0)
    const [showUploader, setShowUploader] = useState(false)
    const { data, setData, processing, post } = useForm({
        title: '',
        content: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route('reminders.create'))
    }

    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} headerTitle="Create Reminder" defaultActiveLink="reminders">
            <ImageUploader closeOnComplete onCompleted={imgUrl => setData('image', imgUrl)} show={showUploader} handleClose={() => setShowUploader(false)} />
            <div className='py-3'>
                <div className="px-[1.5rem]">
                    <Form onSubmit={onSubmit} className='mt-3'>
                        <div className="mb-4">
                            <Form.Label className='text-secondary'>Title:</Form.Label>
                            <Form.Control
                                type='text'
                                required
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder='Enter title here...'
                            />
                        </div>
                        <div className="mb-3">
                            <Form.Label className='text-secondary'>Description:</Form.Label>
                            <textarea className='form-control' onChange={e => setData('content', e.target.value)} rows={3}></textarea>
                        </div>
                        <div className="text-end flex items-center justify-between gap-3 mt-4">
                            <Button variant='light' className='rounded-1' as={Link} href={route('admin.reminders')}>
                                <i className='fi fi-rr-arrow-back'></i> Cancel
                            </Button>
                            <Button className='rounded-1 btn-light-success py-2' type='submit'>
                                <div className="flex justify-center items-center gap-1">
                                    <span className="text-sm">Submit</span>
                                    <i className='bx bx-right-arrow-alt leading-none'></i>
                                </div>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </PanelLayout>
    )
}

export default CreateReminder
