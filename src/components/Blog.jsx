// Componenet for main display of all blog posts

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import ReactTimeAgo from 'react-time-ago';
import { convert } from 'html-to-text';
import { v4 as uuidv4 } from 'uuid'
import useAxiosPrivate from '../hooks/useAxiosPrivate.js'
import useError from '../hooks/useError';

const Blog = () => {
    const LIMIT = 10; // Number of posts loaded at a time
    const MAX_PREV_CHAR = 450; // Number of character to display in preview
    
    const axiosPrivate = useAxiosPrivate();
    const { setErr } = useError();
    const [content, setContent] = useState([]);
    const [loadMore, setLoadMore] = useState();

    const getPreview = (post) => {
        const start = /<p>/.exec(post);
        const end = /<\/p>/.exec(post);
        const opts = { wordwrap: null };
        const toText = convert(post.slice(start.index, end.index + 4), opts);
        if (toText.length <= MAX_PREV_CHAR) return toText;
        let seek = MAX_PREV_CHAR;
        while (seek-- >= 0) {
            if (toText.charAt(seek) === ' ') {
                return toText.slice(0, seek);
            }
        }
        return '';
    }

    const getPostURL = (id, title) => {
        return `/${id.concat('/', title.replaceAll(' ', '-'))}`.toLowerCase();
    }

    const getContent = useCallback(async (page) => {
        try {
            const controller = new AbortController();
            const response = await axiosPrivate.get(`/post/?page=${page}&&limit=${LIMIT}`, {
                signal: controller.signal
            });
            const data = response.data;
            const section = data.posts.map((post, i) => 
                !post.pub ? (<></>) :
                (
                    <li key={uuidv4()}>
                        <div className='blog-item'>
                            <Link className='no-deco' to={ getPostURL(post._id, post.title) } state={{ post }}><h1>{post.title}</h1></Link>
                            <div className='blog-info'>
                                <ReactTimeAgo date={Date.parse(post.pubDate)}/>
                                <div>by {post.user.name}</div>
                                <div><FontAwesomeIcon icon={faMessage} size='xs' />&nbsp;{post.cmntCount ? post.cmntCount : '0'}</div>
                            </div>
                            <div className='blog-prev'>
                                {getPreview(post.pub)}
                                &nbsp;
                                [<Link to={ getPostURL(post._id, post.title) } state={{ post }}>more</Link>]
                            </div>
                        </div>
                    </li>
                )
            );
            setLoadMore((
                <div className='blog-loader'>
                    {
                        (data.total / (LIMIT * (data.page + 1)) > 1)
                            ? (<button type='button' onClick={() => getContent(page + 1)}>Load More</button>)
                            : (<h3>--End of Content--</h3>)
                    }
                </div>
            ))
            setContent(prev => {
                return [...prev, section]
            })

        } catch (err) {
            setErr(err.response?.data.message ? err.response.data.message : ['Server Error']);
        }
    }, [axiosPrivate, setErr])

    useEffect(() => {
        getContent(0);
    }, []);


    return (
        <div className='blog-area'>
            <ul>
                {content}
            </ul>
            {loadMore}
        </div>
    )
}

export default Blog;
