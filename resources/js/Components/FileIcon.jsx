import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap';

const FileIcon = ({ file, className, round = false, size = 'sm' }) => {
    // default icon, file.png
    const [icon, setIcon] = useState('/images/file-icons/file.png');
    const icons = [
        {
            ext: ['doc', 'docx'],
            icon: 'doc.png',
        },
        {
            ext: ['pdf'],
            icon: 'pdf.png',
        },
        {
            ext: ['xlsx', 'xsl', 'xlsm', 'csv', 'def'],
            icon: 'excel.png',
        },
    ];

    const imageExt = ['png', 'jpeg', 'jpg', 'webp', 'gif'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);

    useEffect(() => {
        // check if image
        if (imageExt.includes(fileExt)) {
            setIcon(file.uri);
        } else {
            for (let i of icons) {
                if (i.ext.includes(fileExt)) {
                    setIcon('/images/file-icons/' + i.icon)
                    break;
                }
            }
        }
    },[file,fileExt]);

    return (
        <div className={`${className} ${round ? 'rounded-circle' : ''} file-icon ${size}`}>
            <Image
                src={icon}
                fluid
            />
        </div>
    )
}

export default FileIcon