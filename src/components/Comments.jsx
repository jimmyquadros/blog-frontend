import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import CommentEditor from './editor/CommentEditor';
import Comment from './Comment';
import Login from './Login';
import {ErrorProvider} from '../context/ErrorProvider';
import useError from '../hooks/useError';

const Comments = ({ post }) => {
    const { auth } = useAuth();
    const { setErr } = useError();
    const [comments, setComments] = useState([]);
    const isMounted = useRef(false);
    const scrollCmnt = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const content = await axios.get(`/comment/${post._id.toString()}`);
                setComments(content.data);
            } catch (err) {
                setErr(err.response.data.message);
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
        console.log('cmnt to add: ', cmnt)
        setComments([...comments, cmnt[0]]);
    };

    return (
        <div className='comment-container'>
            { auth ? (
                <div className='comment-editor-container'>
                    <ErrorProvider>
                        <CommentEditor id={ post._id.toString() } addReply={ addComment } />
                    </ErrorProvider>
                </div>
            ) : (
                <ErrorProvider>
                    <div className='comment-login'>
                        <h2>Login or register to join leave a comment.</h2>
                        <Login />
                    </div>
                </ErrorProvider>
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
                            </li>
                        )
                    })
                )}
            </ul>
        </div>
    )
}

export default Comments;