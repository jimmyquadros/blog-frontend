// Comment component which handles management of all child comments

import { useState, useEffect, useRef, forwardRef } from 'react';
import parse from 'html-react-parser';
import ReactTimeAgo from 'react-time-ago';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
import { ErrorProvider } from '../context/ErrorProvider';
import { v4 as uuidv4 } from 'uuid'
import axios from '../api/axios'; 
import TourModal from './TourModal';
import useAuth from '../hooks/useAuth';
import useError from '../hooks/useError';
import useModal from '../hooks/useModal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CommentEditor from './editor/CommentEditor';

const Comment = forwardRef(({ data, toScroll, onDelete }, ref) => {
    const axiosPrivate = useAxiosPrivate();
    const scrollRef = useRef(null);
    const { auth } = useAuth();
    const { setErr } = useError();
    const { setModal } = useModal();
    const [commentData, setCommentData] = useState({...data});
    const [children, setChildren] = useState([...data.children]);
    const [user, setUser] = useState(data.user);
    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [fromEditor, setFromEditor] = useState(null);
    const [isDelete, setIsDelete] = useState(null);
    const [disable, setDisable] = useState(null);
    const isUser = (auth?.username === user?.name);
    const isAdmin = (auth?.roles?.includes(9000));

    // Scroll to a comment added after initial comment load
    useEffect(() => {
        if (!isMounted) return setIsMounted(true);
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [children])

    const getChildren = async () => {
      try {
        const response = await axios.get(`/comment/${commentData._id.toString()}`);
        setChildren(response.data[0].children);
      } catch (err) {
        console.log(err);
      }
    }

    const handleUserDelete = async () => {
      // setErr([]);
      if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
      try {
        setDisable(true);
        const prompt = (auth.username === commentData.user.name) ? 'comment deleted by user' : 'comment removed by moderator'
        const response = await axiosPrivate.put(`/comment/${commentData._id.toString()}`, {user: false, content: prompt})
        setCommentData(response.data);
        setUser(null);
        // setBtnConf(null);
      } catch (err) {
          setDisable(false);
          setErr(err.response.data.message);
      } finally {
        setDisable(false);
        setIsDelete(false);
      }
    }

    const handleAdminDelete = async () => {
      // setErr([]);
      if (auth?.roles?.includes(1000)) return setModal(<TourModal />);
      try {
        setDisable(true);
        await axiosPrivate.delete(`/comment/${commentData._id}`);
        await onDelete();
      } catch (err) {
          setDisable(false);
          console.log('err in delete')
      }
    }

    const handleUpdateChildren = (data) => {
      console.log('Children updating with: ', data)
      return setChildren(data);
    }

    return (
        <div className='comment-item' ref={ref}>
          <ErrorProvider>
          { (user) ? (<h3>{user.name}</h3>) : (<h3 className='comment-deleted'>deleted</h3>)}
          <div className='comment-date'> 
            <ReactTimeAgo date={Date.parse(commentData.createdAt)}/>
          </div>
          {isEdit ? (
              <ErrorProvider>
                <CommentEditor 
                  cancel={() => setIsEdit(false)} 
                  edit={{content: commentData.content, update: setCommentData}} 
                  id={commentData._id.toString()} 
                  />
              </ErrorProvider>
            ) : (
              <div className='comment-content'>
                {parse(commentData.content)}
                {isReply ? (
                  <CommentEditor 
                    cancel={() => {setIsReply(false)}} 
                    id={commentData.root} 
                    parent={ commentData._id }
                    addReply={ setChildren }
                  />
                ) : 
                  isDelete ? (
                    <div className='comment-delete'>
                      <p>Delete Comment?</p>
                      {(user && (isUser || isAdmin)) && (<button type='button' disabled={disable} onClick={() => handleUserDelete()}>Delete</button>)}
                      {isAdmin && (<button className='comment-delete-admin' type='button' disabled={disable} onClick={() => handleAdminDelete()}><FontAwesomeIcon icon={faUserGear} /> DELETE</button>)}
                      <button type='button' disabled={disable} onClick={() => setIsDelete(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className='comment-control'>
                      {user && (
                          <button
                            type='button'
                            onClick={() => setIsReply(true)}>Reply</button>
                      )}
                      {isUser && (
                          <div>
                            <button
                              type='button'
                              onClick={() => {setIsEdit(true)}}>Edit</button>
                          </div>
                      )}
                      {(isUser || isAdmin) && (
                          <div>
                            <button
                              type='button'
                              onClick={() => {
                                setIsDelete(true);
                              }}>Delete</button>
                          </div>
                      )}
                      <div><button type='button' 
                        onClick={async () => {
                          try{
                            await axios.get(`/post/error/`)
                          } catch(err) {
                            setErr(err.response.data)
                          }}}>ERROR</button></div>
                    </div> 
                  )
                }           
              </div>
            )}
        <div className='comment-reply-wrap'>
          <ul ref={scrollRef}>
            {children.map((cmnt, i) => (
                <li key={uuidv4()}>
                  <div className='comment-divider'></div>
                  <Comment data={cmnt} onDelete={getChildren} ref={scrollRef} />
                </li>
            ))}
          </ul>
        </div>
        </ErrorProvider>
      </div>
    )
})

Comment.displayName = 'Comment'

export default Comment
