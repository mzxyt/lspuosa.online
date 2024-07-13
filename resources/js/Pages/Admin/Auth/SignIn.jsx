import AuthLayout from '@/Layouts/AuthLayout'
import { Link, useForm } from '@inertiajs/react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button, Card, Form, Image, Spinner } from 'react-bootstrap'
import jwt_decode from "jwt-decode";
import { useCookies } from 'react-cookie';
import axios from 'axios';

const SignIn = () => {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        type: 'super_admin'
    });

    const [user, setUser] = useState(null)

    const onSubmit = (e) => {
        e.preventDefault();
        post('/login');
    }

    const login = useGoogleLogin({
        onSuccess: codeResponse => {
            console.log(codeResponse)
            console.log('decoded: ', codeResponse.code)
        },
        flow: 'auth-code',
    });


    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
            );
            setUser(userInfo.data)
            console.log(userInfo);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <AuthLayout title="Super admin">
            {
                user ? (
                    <Card>
                        <Card.Body className='text-center'>
                            <Image
                                fluid
                                src={user.picture}
                                alt={user.name}
                                roundedCircle
                                className='mx-auto'
                            />
                            <p className='mt-3'>{user.name}</p>
                        </Card.Body>
                    </Card>
                ) : (
                    <Form onSubmit={onSubmit}>
                        <div className="mt-4 text-center">
                            <Button variant='white' onClick={googleLogin} className='col-12 border rounded-1 d-flex align-items-center'>
                                <Image
                                    src="/images/google.png"
                                    width={30}
                                    height={30}
                                />
                                <small className='mx-auto fw-bold'>Sign in with Google</small>
                            </Button>
                            <Link href='/' className='btn btn-white mt-3 text-secondary col-12 py-2 border rounded-1 d-flex align-items-center'>
                                <i className='bx bx-arrow-back'></i>
                                <small className='mx-auto fw-bold'>Go Back</small>
                            </Link>
                        </div>
                    </Form>
                )
            }
        </AuthLayout>
    )
}

export default SignIn