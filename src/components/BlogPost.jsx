import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Error from './Error';
import Comments from './Comments';
import parse from 'html-react-parser';
import {DateTime} from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';


const BlogPost = () => {
    const params = useParams();
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(location?.state?.post ? location.state.post : null);

    useEffect(() => {
        if (!post) {
            const getPost = async () => {
                try {
                    const response = await axios.get(`/post/${params.id}`);
                    setPost(response.data);
                } catch (err) {
                    setNotFound(true)
                }
            }
            getPost();
        }
    }, [post, params.id])

    const handleNavigate = useCallback((url) => {
        navigate(url, {replace: true, state: {post}})
    }, [navigate, post])

    useEffect(() => {
        // console.log(post)
        if (post && !params.title) {
            const url = `/${post._id.concat('/', post.title.replaceAll(' ', '-'))}`.toLowerCase();
            handleNavigate(url)
        } 
    }, [post, params.title, handleNavigate]);

    return (
        <div className='full-height'>
            {(notFound) ? (<Error />) :
                (post) ? (
                    <div className='blog-post-area'>
                        <h1>{post.title}</h1>
                        <div className='blog-header'>
                            <div> published by {post.user.name} on {DateTime.fromISO(post.pubDate).toLocaleString(DateTime.DATE_MED)}</div>
                            <div><FontAwesomeIcon icon={faMessage} size='xs' />&nbsp;{post.cmntCount ? post.cmntCount : '0'}</div>
                        </div>
                        {parse(post.pub)}
                        <div className='thick-break'></div>
                        <Comments post={post} />
                    </div>
                ) : (
                    <></>
                )}
        </div>

    )
}

export default BlogPost;