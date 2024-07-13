import NavbarComponent from '@/Components/Navbar';
import AppLayout from '@/Layouts/AppLayout';
import PanelLayout, { LayoutType } from '@/Layouts/PanelLayout';
import { useThemeState } from '@/States/States';
import { Link, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Alert, Card,Button } from 'react-bootstrap';

export default function Dashboard({ auth }) {
    const [count, setCount] = useState(0)

    return (
        <PanelLayout userAuth={auth} layout={LayoutType.SUPER_ADMIN} defaultActiveLink="dashboard">
            <div className='py-3'>
                <div className="container-fluid">
                    <Card className='border-0 shadow-sm'>
                        <Card.Body>
                            <p className='my-2 text-gray-900'>Welcome</p>
                            <p>Count: {count}</p>
                            <Button onClick={() => setCount(s => s + 1)}>Increment</Button>

                        </Card.Body>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    );
}
