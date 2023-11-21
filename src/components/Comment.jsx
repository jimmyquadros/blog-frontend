import { useState, useEffect, useRef } from 'react';
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

const Comment = ({ data, remove, comments, setComments, index }, ref) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { setErr } = useError();
    const [btnConf, setBtnConf] = useState(null);
    const [content, setContent] = useState(data.content);
    const [children, setChildren] = useState(data.children);
    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [user, setUser] = useState(data.user);
    
    const isMounted = useRef(false);
    const scrollRef = useRef(null);

    // useEffect(() => {
    //   console.log('data: ', data)
    // })

    // Scroll to a comment added after initial comment load
    useEffect(() => {
        if (isMounted.current) {
            scrollRef.current?.lastElementChild?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
        isMounted.current = true;
    }, [children])

    const ConfirmDelete = ({ delMethod, isAdmin }) => {
        const [disable, setDisable] = useState(false);
        const handleDelete = async () => {
            setDisable(true);
            await delMethod();
            setDisable(false);
        }

        return (
          <div className='comment-delete'>
              <p>{isAdmin ? 'Remove comment and all replies?' : 'Delete comment?'}</p>
              <button type='button' disabled={disable} onClick={handleDelete}>Delete</button>
              <button type='button' disabled={disable} onClick={() => setBtnConf(null)}>Cancel</button>
          </div>
        )
    }

    const UserDelete = () => {
      const [disable, setDisable] = useState(false);
      const { setErr } = useError();
      const handleDelete = async () => {
        try {
          setDisable(true);
          const prompt = (auth.username === user.name) ? 'comment deleted by user' : 'comment removed by moderator'
          const response = await axiosPrivate.put(`/comment/${data._id.toString()}`, {user: false, content: prompt})

          setBtnConf(null);
          return setComments([
            ...comments.slice(0, index),
            response.data,
            ...comments.slice(index + 1)
          ]);
        } catch (err) {
            setDisable(false);
            setErr(err.response.data.message);
        }
      }

      return (
        <div className='comment-delete'>
          <p>Delete Comment?</p>
          <button type='button' type='button' disabled={disable} onClick={handleDelete}>Delete</button>
          <button type='button' type='button' disabled={disable} onClick={() => setBtnConf(null)}>Cancel</button>
        </div>
      )
    }

    const AdminDelete = () => {
      const [disable, setDisable] = useState(false);
      const { setErr } = useError();
      const handleDelete = async () => {
        try {
          setDisable(true);
          await axiosPrivate.delete(`/comment/${data._id.toString()}`);
          setBtnConf(null);
          return setComments(
            [
              ...comments.slice(0, index),
              ...comments.slice(index + 1)
            ]
          );
        } catch (err) {
            setDisable(false);
            setErr(err.response.data.message);
        }
      }

      return (
        <div className='comment-delete'>
          <p>Remove comment and all replies?</p>
          <button type='button' type='button' disabled={disable} onClick={handleDelete}>Delete</button>
          <button type='button' type='button' disabled={disable} onClick={() => setBtnConf(null)}>Cancel</button>
        </div>
      )
    }

    const handleAddComment = (cmnt) => {
        setChildren([...children, cmnt[0]]);
    }

    return (
        <div className='comment-item'>
          { (user) ? (<h3>{user.name}</h3>) : (<h3 className='comment-deleted'>deleted</h3>)}
          <div className='comment-date'> 
            <ReactTimeAgo date={Date.parse(data.createdAt)}/>
          </div>
          {isEdit ? (
              <ErrorProvider>
                <CommentEditor 
                  cancel={() => setIsEdit(false)} 
                  edit={{content, update: setContent}} 
                  id={data._id.toString()} 
                  addReply={handleAddComment} />
              </ErrorProvider>
            ) : (
              <div className='comment-content'>
                {parse(content)}
                {isReply ? (
                  <ErrorProvider>
                    <CommentEditor 
                      cancel={() => setIsReply(false)} 
                      id={data.root} 
                      parent={ data._id }
                      addReply={ handleAddComment } />
                    </ErrorProvider>
                ) : (
                  <ErrorProvider>
                    {!btnConf ? (
                      <div className='comment-control'>
                          { user && (
                              <button
                              type='button'
                              onClick={() => setIsReply(true)}>Reply</button>
                          )}
                          {(auth?.username === user?.name) && (
                              <div>
                                  <button
                                    type='button'
                                    onClick={() => {setIsEdit(true)}}>Edit</button>
                              </div>
                          )}
                          {((auth?.username === user?.name) || (auth?.roles?.includes(9000))) && (
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
                  <Comment data={cmnt} comments={children} setComments={setChildren} index={i} />
                </li>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default Comment