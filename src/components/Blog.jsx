import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import ReactTimeAgo from 'react-time-ago';
import { convert } from 'html-to-text';


const Blog = () => {
    const LIMIT = 10;
    const MAX_PREV_CHAR = 450;
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
            const response = await axios.get(`/post/?page=${page}&&limit=${LIMIT}`);
            const data = response.data;
            getPreview(data.posts[0].pub);
            const section = data.posts.map((post, i) => 
                (
                    <li key={`${page}${i}`}>
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
            console.error(err);
        }
    }, [])

    useEffect(() => {
        getContent(0);
    }, [getContent]);


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