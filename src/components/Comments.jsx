import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import CommentEditor from './editor/CommentEditor';
import Comment from './Comment';
import Login from './Login';


const Comments = ({ post }) => {
    const { auth } = useAuth();
    const [comments, setComments] = useState();
    const isMounted = useRef(false);
    const scrollCmnt = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const content = await axios.get(`/comment/${post._id.toString()}`);
                setComments(content.data);
            } catch (err) {
                console.error(err);
            }
        })()
    }, [post._id]);

    useEffect(() => {
        if (isMounted.current && scrollCmnt.current) {
            scrollCmnt.current?.lastElementChild?.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
        if (!isMounted.current && comments) isMounted.current = true;
    }, [comments])

    const addComment = (cmnt) => {
        setComments(prev => {return [...prev, cmnt]});
    };

    return (
        <div className='comment-container'>
            { auth ? (
                <CommentEditor id={ post._id.toString() } addReply={ addComment } />
            ) : (
                <div className='comment-login'>
                    <h2>Login or register to join leave a comment.</h2>
                    <Login />
                </div>
            )}
            <ul ref={scrollCmnt}>
                {!comments?.length ? (
                    <h3>There are no comments</h3>
                ) : (
                    comments.map((cmnt, i) => {
                        return (
                        <li key={i}>
                            {i === 0 ? (<></>) : (<div className='comment-divider'></div>)}
                            <Comment data={cmnt} />
                        </li>)
                    })
                )}
            </ul>
        </div>
    )
}

export default Comments;