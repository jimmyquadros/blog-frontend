import { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import ReactTimeAgo from 'react-time-ago';
import useAuth from '../hooks/useAuth';
import CommentEditor from './editor/CommentEditor';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear } from '@fortawesome/free-solid-svg-icons';


const Comment = ({ data }, ref) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [btnConf, setBtnConf] = useState(null);
    const [content, setContent] = useState(data.content);
    const [children, setChildren] = useState(data.children);
    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [user, setUser] = useState(data.user);
    
    const isMounted = useRef(false);
    const scrollRef = useRef(null);



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

    const handleAddComment = (cmnt) => {
        setChildren(prev => {return [...prev, cmnt]});
    }

    const handleAdminDelete = async () => {
        try {
            await axiosPrivate.delete(`/comment/${data._id.toString()}`);
            window.location.reload(false);
            return 1;
        } catch (err) {
            console.error(err);
            return 0;
        }
    }

    const handleUserDelete = async () => {
        try {
            const delContent = (auth.username === user.name) ? 'comment deleted by user' : 'comment removed by moderator'
            const deleted = await axiosPrivate.put(`/comment/${data._id.toString()}`, {user: false, content: delContent})
            setUser(null);
            setContent(deleted.data.content);
            setBtnConf(null);
            return 1;
        } catch (err) {
            console.error(err);
            return 0;
        }
    }

    return (
        <div className='comment-item'>
          { (user) ? (<h3>{user.name}</h3>) : (<h3 className='comment-deleted'>deleted</h3>)}
          <div className='comment-date'> 
            <ReactTimeAgo date={Date.parse(data.createdAt)}/>
          </div>
          {isEdit ? (
            <>
              <CommentEditor 
                cancel={() => setIsEdit(false)} 
                edit={{content, update: setContent}} 
                id={data._id.toString()} 
                addReply={handleAddComment} />
            </>
            ) : (
              <div>
                <div className='comment-content'>
                  {parse(content)}
                </div> 
                {isReply ? (
                  <CommentEditor 
                    cancel={() => setIsReply(false)} 
                    id={data.root} 
                    parent={ data.parent ? [...data.parent, data._id] : [data._id]}
                    addReply={ handleAddComment } />
                ) : (
                  <div>
                    {!btnConf ? (
                        <div>
                            {auth && (
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
                                             onClick={() => setBtnConf(<ConfirmDelete delMethod={handleUserDelete} />)}>Delete</button>
                                        </div>
                                    )}
                                    {auth?.roles?.includes(9000) && (
                                        <button
                                            className='comment-delete-admin'
                                            type='button'
                                            onClick={() => setBtnConf(<ConfirmDelete delMethod={handleAdminDelete} isAdmin={true} />)}><FontAwesomeIcon icon={faUserGear} /> DELETE</button>
                                    )}
                                </div> 
                            )}
                        </div>
                    ) : (
                        <>{btnConf}</>
                    )}
                  </div>
                )}           
              </div>
            )}
        { children && (
          <div className='comment-reply-wrap'>
            <ul ref={scrollRef}>
              {children.map((cmnt, i) => {
                return (
                  <li key={`${data._id}-${i}`}>
                    <div className='comment-divider'></div>
                    <Comment data={cmnt} />
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    )
}

export default Comment