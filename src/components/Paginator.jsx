import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Spinner from './Spinner';
import Modal from './Modal';


const LIMIT = 8;

const Paginator = ({setMsg}) => {

    const [posts, setPosts] = useState();
    const [pageIndex, setPageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState();

    const axiosPrivate = useAxiosPrivate();

    const handleGetPosts = async() => {
        let isMounted = true;
        setIsLoading(true);
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.get(`/post/?page=${pageIndex}&&limit=${LIMIT}`, {
                signal: controller.signal
            });
            isMounted && setPosts(response.data);
            setIsLoading(false)
        } catch (err) {
            console.error('error!');
        }
        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const handleDeletePost = async (id) => {
        const controller = new AbortController();
        setModal((<Spinner />))
        try {
            const response = await axiosPrivate.delete(`/post/${id}`, {
                signal: controller.signal,
            })
            setMsg(['Post deleted successfully'])
            setModal();
            handleGetPosts();
        } catch (err) {
            setMsg(['Failed to delete post'])
            setModal();
            return;
        }
    }

    const renderModal = (post) => {
        setModal((
            <div className='modal-content'>
                <h3>Are you sure you want to delete this file?</h3>
                <div className='form-submit-right'>
                    <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                    <button onClick={() => setModal()}>Cancel</button>
                </div>
            </div>
        ))
    }

    const renderPagination = () => {
        if (!posts?.posts?.length) return (<></>) 
        const pageItems = [];
        for (let i = 0; i < posts.posts.length; i++) {
            const post = posts.posts[i];
            pageItems.push(
                <div key={`name${i}`}><Link to='/editor' state={{ post }} >{post.title}</Link></div>
                
            );
            pageItems.push(<div key={`date${i}`}>{DateTime.fromISO(post.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</div>);
            pageItems.push(<div key={`pub${i}`}>{(post.pub) ? 'PUBLISHED': 'UNPUBLISHED'}</div>)
            pageItems.push(<div key={`del${i}`}><FontAwesomeIcon icon={faTrashCan} onClick={() => renderModal(post) } /></div>)
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

    useEffect(() => {
        handleGetPosts();
    }, [pageIndex])

    useEffect(() => {
        renderPageIndex();
    }, [posts, pageIndex]);

    

    return (
        <div className='paginator-area'>
            <Modal content={modal} close={ () => setModal() } />
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