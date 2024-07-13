import CardComponent from '@/Components/CardComponent'
import PanelLayout from '@/Layouts/PanelLayout'
import { Link, useForm } from '@inertiajs/react'
import React from 'react'
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap'


const EditAdmin = ({ admin, campuses }) => {
    const { data, setData, processing, errors, patch } = useForm({
        firstname: admin.firstname,
        lastname: admin.lastname,
        middlename: admin.middlename,
        campus_id: admin.campus_id,
        email: admin.email,
    });
    const onSubmit = (e) => {
        e.preventDefault()
        patch(route('campus_admin.edit', { id: admin.id }));
    }

    return (
        <PanelLayout headerTitle="Campus Admin" defaultActiveLink='admins'>
            <div className="py-3 px-[1.5rem]">
                <CardComponent>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <div className="fle">
                                <p className="fw-bold">
                                    Editing Campus Admin
                                </p>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <Row className='gy-3'>
                                    <Col lg>
                                        <Form.Label>
                                            <span className="text-sm text-danger me-1">*</span>
                                            <span>Firstname:</span>
                                        </Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={data.firstname}
                                            onChange={e => setData('firstname', e.target.value)}
                                        />
                                        <p className="mb-0 mt-2 text-sm text-danger">{errors?.firstname}</p>
                                    </Col>
                                    <Col lg>
                                        <Form.Label>Middlename:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={data.middlename}
                                            onChange={e => setData('middlename', e.target.value)}
                                        />
                                        <p className="mb-0 mt-2 text-sm text-danger">{errors?.middlename}</p>
                                    </Col>
                                    <Col lg>
                                        <Form.Label><span className="text-sm text-danger me-1">*</span>Lastname:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={data.lastname}
                                            onChange={e => setData('lastname', e.target.value)}
                                        />
                                        <p className="mb-0 mt-2 text-sm text-danger">{errors?.lastname}</p>
                                    </Col>
                                </Row>
                            </div>

                            <div className="mb-3">
                                <Row className='gy-3'>
                                    <Col lg>
                                        <Form.Label>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-sm text-danger ">*</span>
                                                <Image
                                                    src='/images/google.png'
                                                    fluid
                                                    width={18}
                                                    height={18}
                                                />
                                                <span className="">Email address</span>
                                                <span className="text-sm text-secondary">
                                                    (Must be a google account.)
                                                </span>
                                            </div>
                                        </Form.Label>
                                        <Form.Control
                                            placeholder='Eg. example@gmail.com'
                                            type='email'
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                        <p className="mb-0 mt-2 text-sm text-danger">{errors?.email}</p>
                                    </Col>
                                    <Col>
                                        <Form.Label><span className="text-sm text-danger me-1">*</span>Campus:</Form.Label>
                                        <Form.Select value={data.campus_id} onChange={e => setData('campus_id', e.target.value)}>
                                            {
                                                campuses && campuses.map((campus, index) => (
                                                    <option key={index} value={campus.id}>{campus.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                        <p className="mb-0 mt-2 text-sm text-danger">{errors?.campus_id}</p>
                                    </Col>
                                </Row>
                            </div>

                            <div className="text-end">
                                <Button as={Link} href={route('admin.admins')} variant='light' type='submit' className='mt-3 me-2 rounded-1'>Cancel</Button>
                                <Button variant='primary' type='submit' className='mt-3 rounded-1'>Submit</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </CardComponent>
            </div>
        </PanelLayout>
    )
}

export default EditAdmin