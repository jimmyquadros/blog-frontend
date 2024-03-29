// Paginator component for administrative viewing of all articles

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid'
import Spinner from './Spinner';
import TourModal from './TourModal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useModal from '../hooks/useModal';
import useAuth from '../hooks/useAuth';
import useError from '../hooks/useError';

const LIMIT = 8; // number of items displayed on page

const Paginator = ({setMsg}) => {

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { setModal } = useModal();
    const { setErr } = useError();

    const [posts, setPosts] = useState();
    const [pageIndex, setPageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleGetPosts();
    }, [pageIndex])

    useEffect(() => {
        renderPageIndex();
    }, [posts, pageIndex]);

    const handleGetPosts = async() => {
        setErr([])
        let isMounted = true;
        setIsLoading(true);
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.get(`/post/private/?page=${pageIndex}&&limit=${LIMIT}`, {
                signal: controller.signal
            });
            isMounted && setPosts(response.data);
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            setErr(err.response.data.message);
        }
        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const handleDeletePost = async (id) => {
        setErr([]);
        const controller = new AbortController();
        setModal((<Spinner />))
        try {
            await axiosPrivate.delete(`/post/${id}`, {
                signal: controller.signal,
            })
            setMsg(['Post deleted successfully'])
            setModal();
            handleGetPosts();
        } catch (err) {
            setErr(err.response.data.message);
            setModal();
        }
    }

    const renderDeleteModal = (post) => {
        return (auth?.roles?.includes(1000)) ? (
                <TourModal />
            ) : (
                <div>
                    <h3>Are you sure you want to delete this file?</h3>
                    <div className='form-submit-right'>
                        <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                        <button onClick={() => setModal()}>Cancel</button>
                    </div>
                </div>
            )
    }

    const renderPagination = () => {
        if (!posts?.posts?.length) return (<></>) 
        const pageItems = [];
        for (let i = 0; i < posts.posts.length; i++) {
            const post = posts.posts[i];
            pageItems.push(
                <div key={uuidv4()}><Link to='/editor' state={{ post }} >{post.title}</Link></div>
            );
            pageItems.push(<div key={`date${i}`}>{DateTime.fromISO(post.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</div>);
            pageItems.push(<div key={`pub${i}`}>{(post.pub) ? 'PUBLISHED': 'UNPUBLISHED'}</div>)
            pageItems.push(<div key={`del${i}`}><FontAwesomeIcon icon={faTrashCan} onClick={() => setModal(renderDeleteModal(post)) } /></div>)
        };
        return pageItems;
    }

    const renderPageIndex = () => {
        if (!posts) return (<></>);
        const scope = 9;
        const halfScope = 4
        const totalPages = Math.ceil((posts.total / LIMIT)) - 1;
        let lowerLimit;
        let upperLimit;
        // page count doesn't require truncation
        if (totalPages <= scope) {
            lowerLimit = 0
            upperLimit = totalPages;
        }
        // truncate the end, leave the front
        else if (pageIndex < halfScope) {
            lowerLimit = 0;
            upperLimit = scope - 1;
        }
        // truncate front, persist end
        else if (pageIndex + halfScope > totalPages) {
            lowerLimit = totalPages - scope + 1;
            upperLimit = totalPages;
        }
        // truncate both ends
        else {
            lowerLimit = pageIndex - halfScope
            upperLimit = pageIndex + halfScope;
        }
        const pages = [];
        // backarrow
        if (pageIndex > 0) {
            pages.push(<div key={'back-one'}><button className='link-to' onClick={(e) => {setPageIndex((prev) => { return prev - 1})}}>{`<<`}</button></div>)
        }
        // shortcut to front
        if (lowerLimit > 0) {
            pages.push(<div key={'to-front'}><button className='link-to' onClick={(e) => setPageIndex(0)}>1</button></div>)
            pages.push(<div key={'front-elipse'}>...</div>)
        }
        // listed values
        for (let i = lowerLimit; i <= upperLimit; i++) {
            pages.push(
                (<div key={`page${i}`}>
                    {(pageIndex === i) 
                        ? (<button>{i + 1}</button>)
                        : (<button className='link-to' onClick={(e) => setPageIndex(i)}>{i + 1}</button>)}
                    
                </div>)
            )
        }
        // shortcut to back
        if (pageIndex + halfScope < totalPages) {
            pages.push(<div key={'back-elipse'}>...</div>)
            pages.push(<div key={'to-end'}><button className='link-to' onClick={(e) => setPageIndex(totalPages)}>{totalPages + 1}</button></div>)
        }
        // forward arrow
        if (pageIndex < totalPages) {
            pages.push(<div key={'up-one'}><button className='link-to' onClick={(e) => {setPageIndex((prev) => { return prev + 1})}}>{`>>`}</button></div>)
        }
        return pages;
    }

    return (
        <div className='paginator-area'>
            {isLoading
                ? ( <Spinner /> ) 
                : (
                    <div className='paginator-list'>
                        {renderPagination()}
                    </div>
                )
            }
            <div className='paginator-index'>
                {renderPageIndex()}
            </div>
        </div>
    )
}

export default Paginator;
