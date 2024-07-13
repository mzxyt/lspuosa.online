import React, { useEffect, useRef } from 'react'
import { Image } from 'react-bootstrap'
import ReactTimeAgo from 'react-time-ago'


const Comment = ({ data, pos = "left" }) => (
    <div className='flex gap-3 mb-3 comment'>
        <div>
            <Image
                src={data.user.image}
                width={'35px'}
                height={'35px'}
                alt='User image'
                roundedCircle
            />
        </div>
        <div>
            <div className="flex gap-2">
                <p className="my-0 fw-bold">
                    {data.user.firstname + " " + data.user.lastname}
                </p>
                <div className='text-sm text-black-50'>
                    <ReactTimeAgo timeStyle="mini-minute-now" date={new Date(data.created_at)} locale='en-US' />
                </div>
            </div>
            <p className="my-0 text-sm text-black-50">
                <small>{data.user.user_roles[0]?.display_name}</small>
            </p>
            <p className="mb-0 mt-1">
                {data.comment}
            </p>
        </div>
    </div>
)

const CommentsArea = ({ comments, user }) => {
    const commentsAreaRef = useRef();

    useEffect(() => {
        commentsAreaRef.current.scrollTop = commentsAreaRef.current.scrollHeight;
    }, [comments]);

    return (
        <div className='comments-area scroll-smooth ' ref={commentsAreaRef}>
            {
                comments.map((comment, index) => (
                    <Comment key={index} data={comment} pos={user.id === comment.user.id ? "right" : "left"} />
                ))
            }
        </div>
    )
}

export default CommentsArea