// Component for displaying individual blog posts, reply options, and child comments

import { useState, useEffect, useCallback, useRef , useMemo} from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import {DateTime} from 'luxon';
import { v4 as uuidv4 } from 'uuid'
import axios from '../api/axios';
import { ErrorProvider } from '../context/ErrorProvider';
import useError from '../hooks/useError';
import useAuth from '../hooks/useAuth';
import CommentEditor from './editor/CommentEditor';
import Comment from './Comment';
import Login from './Login';

const BlogPost = () => {

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const { setErr } = useError();
    const scrollRef = useRef(null);

    // const [isLoggedIn, setIsLoggedIn] = useState(auth);

    const [comments, setComments] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [post, setPost] = useState(location?.state?.post ? location.state.post : null);

    const displayComments = useMemo(() => {
        return [...comments]
    }, [comments])

    // TESTING
    // useEffect(() => {
    //     console.log('TOP LEVEL: RENDER')
    // }, [])

    // useEffect(() => {
    //     console.log(`TOP LEVEL: Update comments...`)
    // }, [comments])

    // useEffect(() => {
    //     // console.log('BLOGPOST: scrolling to ref...')
    //     if (isMounted && scrollRef.current) {
    //         scrollRef.current.scrollIntoView({behavior: 'smooth', block: 'center'});
    //     }
    // }, [comments])

    useEffect(() =>  {
        getComments();
        if (!isMounted) return setIsMounted(true);
    }, [])

    const getComments = async (id) => {
        try {
            const content = await axios.get(`post/comments/${post._id.toString()}`);
            setComments(content.data);
        } catch (err) {
            // setErr(err.response.data.message);
        }
    }

    useEffect(() => {
        if (!post) {
            (async () => {
                try {
                    const response = await axios.get(`/post/${params.id}`);
                    setPost(response.data);
                } catch (err) {
                    setErr(err.response.data.message);
                }
            })()
        }
    }, [post, params.id, setErr])

    const handleNavigate = useCallback((url) => {
        navigate(url, {replace: true, state: {post}})
    }, [navigate, post])

    useEffect(() => {
        if (post && !params.title) {
            const url = `/${post._id.concat('/', post.title.replaceAll(' ', '-'))}`.toLowerCase();
            handleNavigate(url)
        } 
    }, [post, params.title, handleNavigate]);

    return (
        <div className='blog-post-container'>
            {post && (
                <div className='blog-post'>
                    <h1>{post.title}</h1>
                    <div className='blog-header'>
                        <div> published by {post.user.name} on {DateTime.fromISO(post.pubDate).toLocaleString(DateTime.DATE_MED)}</div>
                    </div>
                    {parse(post.pub)}
                    <div className='thick-break'></div>
                    <ErrorProvider>
                        <div className='comment-container'>
                            {/* { auth ? (
                                <div className='comment-editor-container'>
                                    <ErrorProvider>
                                        <CommentEditor id={ post._id.toString() } addReply={ setComments } />
                                    </ErrorProvider>
                                </div>
                            ) : (
                                <ErrorProvider>
                                    <div className='comment-login'>
                                        <h2>Login or register to join leave a comment.</h2>
                                        <Login />
                                    </div>
                                </ErrorProvider>
                            )} */}
                            <div className='comment-editor-container'>
                                <ErrorProvider>
                                    <CommentEditor id={ post._id.toString() } addReply={ setComments } />
                                </ErrorProvider>
                            </div>
                            <ul>
                                {!comments?.length ? (
                                    <h3>There are no comments</h3>
                                ) : (
                                    displayComments.map((cmnt, i) => {
                                        return (
                                            <li key={uuidv4()}>
                                                {i === 0 ? (<></>) : (<div className='comment-divider'></div>)}
                                                <Comment data={cmnt} onDelete={getComments} ref={scrollRef} />
                                            </li>
                                        )
                                    })
                                )}
                            </ul>
                        </div>
                    </ErrorProvider>
                </div>
            )}
        </div>
    )
}

export default BlogPost;
