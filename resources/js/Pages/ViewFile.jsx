import PanelLayout from '@/Layouts/PanelLayout'
import React from 'react'
import { Card, Container } from 'react-bootstrap';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'

const ViewFile = ({ file }) => {
    const docs = [
        { uri: file?.uri },
    ];
    return (
        <>
            <Container>
                <Card>
                    <Card.Body>
                        <DocViewer
                            pluginRenderers={DocViewerRenderers}
                            documents={docs}
                        />
                    </Card.Body>
                </Card>
            </Container>

        </>
    )
}

export default ViewFile