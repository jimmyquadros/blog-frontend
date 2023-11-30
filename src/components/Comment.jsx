import { useState, useEffect, useRef, forwardRef } from 'react';
import parse from 'html-react-parser';
import ReactTimeAgo from 'react-time-ago';
import useAuth from '../hooks/useAuth';
import CommentEditor from './editor/CommentEditor';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
import { ErrorProvider } from '../context/ErrorProvider';
import useError from '../hooks/useError';
import { v4 as uuidv4 } from 'uuid'
import axios from '../api/axios'; 

const Comment = forwardRef(({ data, toScroll, onDelete }, ref) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [btnConf, setBtnConf] = useState(null);
    const [commentData, setCommentData] = useState(data);
    const [children, setChildren] = useState(data.children);
    const [user, setUser] = useState(data.user);
    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const scrollRef = useRef(null);

    // Scroll to a comment added after initial comment load
    useEffect(() => {
        if (!isMounted) return setIsMounted(true);
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [children, isMounted])

    const getChildren = async () => {
      try {
        const response = await axios.get(`/comment/${commentData._id.toString()}`);
        setChildren(response.data[0].children);
      } catch (err) {
        console.log(err);
      }
    }

    const UserDelete = () => {
      const [disable, setDisable] = useState(false);
      const { setErr } = useError();
      const handleDelete = async () => {
        try {
          setDisable(true);
          const prompt = (auth.username === commentData.user.name) ? 'comment deleted by user' : 'comment removed by moderator'
          const response = await axiosPrivate.put(`/comment/${commentData._id.toString()}`, {user: false, content: prompt})
          setCommentData(response.data);
          setUser(null);
          setBtnConf(null);
        } catch (err) {
            setDisable(false);
            setErr(err.response.data.message);
        }
      }
      return (
        <div className='comment-delete'>
          <p>Delete Comment?</p>
          <button type='button' disabled={disable} onClick={handleDelete}>Delete</button>
          <button type='button' disabled={disable} onClick={() => setBtnConf(null)}>Cancel</button>
        </div>
      )
    }

    const AdminDelete = () => {
      const [disable, setDisable] = useState(false);
      const { setErr } = useError();
      const handleDelete = async () => {
        try {
          setDisable(true);
          await axiosPrivate.delete(`/comment/${commentData._id}`);
          await onDelete();
        } catch (err) {
            setDisable(false);
            setErr(err.response.data.message);
        }
      }
      return (
        <div className='comment-delete'>
          <p>Remove comment and all replies?</p>
          <button type='button' disabled={disable} onClick={handleDelete}>Delete</button>
          <button type='button' disabled={disable} onClick={() => setBtnConf(null)}>Cancel</button>
        </div>
      )
    }

    return (
        <div className='comment-item' ref={ref}>
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
                  <ErrorProvider>
                    <CommentEditor 
                      cancel={() => setIsReply(false)} 
                      id={commentData.root} 
                      parent={ commentData._id }
                      addReply={setChildren}
                      />
                    </ErrorProvider>
                ) : (
                  <ErrorProvider>
                    {!btnConf ? (
                      <div className='comment-control'>
                          { auth && user && (
                              <button
                              type='button'
                              onClick={() => setIsReply(true)}>Reply</button>
                          )}
                          {(auth?.username === user?.name) && user && (
                              <div>
                                  <button
                                    type='button'
                                    onClick={() => {setIsEdit(true)}}>Edit</button>
                              </div>
                          )}
                          {((auth?.username === commentData.user?.name) || (auth?.roles?.includes(9000))) && user && (
                              <div>
                                  <button
                                    type='button'
                                    onClick={() => setBtnConf(<UserDelete />)}>Delete</button>
                              </div>
                          )}
                          {auth?.roles?.includes(9000) && (
                              <button
                                  className='comment-delete-admin'
                                  type='button'
                                  onClick={() => setBtnConf(<AdminDelete />)}>
                                <FontAwesomeIcon icon={faUserGear} /> 
                                DELETE
                              </button>
                          )}
                      </div> 
                    ) : (
                      <div className='comment-delete-container'>
                        {btnConf}
                      </div>
                    )}
                  </ErrorProvider>
                )}           
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
      </div>
    )
})

export default Comment