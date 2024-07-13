import ElegantNav from '@/Components/ElegantNav';
import FormInput from '@/Components/FormInput';
import AuthLayout from '@/Layouts/AuthLayout'
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { GoogleLogin, hasGrantedAllScopesGoogle, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Image, Spinner, Row, Container, Col, Alert } from 'react-bootstrap'

const Register = () => {
    const [firstname, setFirstname] = useState('')
    const [middlename, setMiddlename] = useState('')
    const [lastname, setLastname] = useState('')
    const [phone, setPhone] = useState('')
    const [image, setImage] = useState('')
    const [email, setEmail] = useState('')
    const [googleAccount, setGoogleAccount] = useState(null)
    const [googleAccesstoken, setGoogleAccesstoken] = useState(null)
    const {flash} = usePage().props

    const onSubmit = (e) => {
        e.preventDefault();
        router.post(route('super_admin.register'), {
                email,
                firstname,
                lastname,
                middlename,
                phone,
                access_token: googleAccesstoken,
                image
            })
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('response: ', tokenResponse)
            // const userInfo = await axios.get(
            //     'https://www.googleapis.com/oauth2/v3/userinfo',
            //     {
            //         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            //         baseURL:''
            //     },
            // );
            const userInfo = await new Promise(resolve => {
                const xhr = new XMLHttpRequest();

                xhr.open('GET', `https://www.googleapis.com/oauth2/v3/userinfo`);
                xhr.setRequestHeader('Authorization', `Bearer ${tokenResponse.access_token}`)
                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300)
                        resolve(JSON.parse(this.responseText));
                    else resolve({ err: '404' });
                };
                xhr.send();
            });
            console.log('user info: ', userInfo);

            setGoogleAccesstoken(tokenResponse.access_token)
            setGoogleAccount(userInfo)
            setFirstname(userInfo.given_name)
            setLastname(userInfo.family_name)
            setImage(userInfo.picture)
            setEmail(userInfo.email)

            const hasAccess = hasGrantedAllScopesGoogle(
                tokenResponse,
                'https://www.googleapis.com/auth/documents',
            );

            console.log('has access: ', hasAccess)
        },
        onError: errorResponse => console.log(errorResponse),
        flow: 'implicit',
        prompt: 'consent'
    });

    return (
        <div className="bg-[#F3F4F6] min-h-screen">
            <Container>
                <Row className='pt-lg-5 pt-3 gy-4'>
                    <Col lg={2}>
                        <Image
                            src='/images/logo.png'
                            alt='OSA Logo'
                            className='img-fluid w-[110px] h-[110px] mx-auto mb-3'
                        />
                        {/* <div className=' text-center'>Create an account to manage system.</div> */}
                        <div variant='primary' className='text-center'>
                            <i className='bx bx-info-circle'></i><br />
                            <span className="text-">Create an account to manage system.</span>
                        </div>
                    </Col>
                    <Col>
                    {flash && flash.failed ?                                         <Alert variant='danger' className='col-xl-7 col-lg-10 mx-auto text-sm shadow'>
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className='fw-bold'>{flash.failed}</span>
                                            </div>
                                        </Alert> : null}
                        <div className="card mb-5 border-0 shadow-md md:min-h-max min-h-full rounded-3">
                            <div className="card-header md:p-20 p-4 bg-white">
                                <div className="text-start">

                                    <p className='my-1 text-uppercase fw-bolder'>
                                        <span className=' text-primary'>Create an Account</span>
                                    </p>
                                    <p className='my-1 text-capitalize fw-bold'>
                                        <span className=' text-secondary'>Super Admin</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card-body md:p-20 p-4">
                                {/* choose google account */}
                                <div className="mb-3">
                                    <p className="mt-1 mb-3 text-black-50 text-sm">Signup with google account to continue:</p>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src='/images/google.png'
                                            width={50}
                                            height={50}
                                        />
                                        <div>
                                            {
                                                googleAccount ? (
                                                    <>
                                                        <div className="flex items-center gap-3">
                                                            <div className="">
                                                                <p className="my-0 text-sm fw-bold">
                                                                    {googleAccount ? `Continue as ${googleAccount.given_name}` : ''}
                                                                </p>
                                                                <p className="my-0 text-sm">
                                                                    {googleAccount.email}
                                                                </p>
                                                            </div>
                                                            <Image
                                                                width={30}
                                                                height={30}
                                                                src={googleAccount.picture}
                                                                roundedCircle
                                                            />
                                                        </div>
                                                        <p onClick={googleLogin} className="my-0 text-sm text-primary cursor-pointer hover:underline">
                                                            <small>Change</small>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p onClick={googleLogin} className="my-0 text-primary cursor-pointer hover:underline">
                                                        Select a Google Account.
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <Form onSubmit={onSubmit}>
                                    <p className="form-text fw-bold mt-1 mb-2">
                                        {
                                            googleAccount ? '' : 'Please select a google account to continue'
                                        }
                                    </p>
                                    <div className="mb-3">
                                        <Form.Label>Firstname:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={firstname}
                                            onChange={e => setFirstname(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your firstname...'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Label>Middlename:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={middlename}
                                            onChange={e => setMiddlename(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your middlename...'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Label>Lastname:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            value={lastname}
                                            onChange={e => setLastname(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your lastname...'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Form.Label>Phone:</Form.Label>
                                        <Form.Control
                                            type='number'
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            disabled={!googleAccount}
                                            placeholder='Enter your phone...'
                                        />
                                    </div>

                                    <div className="text-end">
                                        <br />
                                        <Button variant='primary' type='submit'>Create account <i className='bx bx-right-arrow-alt'></i></Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default Register
