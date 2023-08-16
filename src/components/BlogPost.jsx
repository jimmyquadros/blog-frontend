import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Error from './Error';
import Comments from './Comments';
import parse from 'html-react-parser';


const BlogPost = () => {
    const params = useParams();
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(location?.state?.post ? location.state.post : null);

    useEffect(() => {
        if (!post) getPost()
    }, [])

    useEffect(() => {
        if (post && !params.title) {
            const url = `/${post._id.concat('/', post.title.replaceAll(' ', '-'))}`.toLowerCase();
            navigate(url, {replace: true, state: {post}})
        } 
    }, [post]);

    const getPost = async () => {
        try {
            const response = await axios.get(`/post/${params.id}`);
            setPost(response.data);
        } catch (err) {
            setNotFound(true)
        }
    }

    return (
        <div className='full-height'>
            {(notFound) ? (<Error />) :
                (post) ? (
                    <div className='blog-post-area'>
                        <h1>{post.title}</h1>
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