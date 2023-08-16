import { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import ReactTimeAgo from 'react-time-ago';
import useAuth from '../hooks/useAuth';
import CommentEditor from './editor/CommentEditor';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Comment = ({ data }, ref) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [content, setContent] = useState(data.content);
    const [children, setChildren] = useState(data.children);
    const [btnDisplay, setBtnDisplay] = useState((<></>));
    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);

    const isMounted = useRef(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        setBtnDisplay(getButtons());
    }, [])

    // Scroll to a comment added after initial comment load
    useEffect(() => {
        if (isMounted.current) {
            scrollRef.current?.lastElementChild?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
        isMounted.current = true;
    }, [children])

    // Display comment text and buttons or comment editor
    const getComment = () => {
        return (
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
                      <>
                        {btnDisplay}
                      </>
                    )}           
            </div>
        )
    }

    // Set user controls only if logged-in
    const getButtons = () => {
        return auth ? (
            <div className='comment-control'>
                {data.user ? (
                    <button
                    type='button'
                    onClick={() => setIsReply(true)}>Reply</button>
                ) : (<></>) }
                
                {auth.username === data.user?.name ? (
                    <div className='comment-control-user'>
                        <button
                          type='button'
                          onClick={() => {setIsEdit(true)}}>Edit</button>
                        <button
                          type='button'
                          onClick={() => setBtnDisplay(getConfirmUserDelete())}>Delete</button>
                    </div>
                ): (<></>)}
            </div> 
        ) : (<></>)
    }

    const getConfirmUserDelete = () => {
        return (
            <div className='comment-delete'>
                <p>Delete comment?</p>
                <button type='button'>Delete</button>
                <button type='button' onClick={() => setBtnDisplay(getButtons())}>Cancel</button>
            </div>
        )
    }

    const handleAddComment = (cmnt) => {
        setChildren(prev => {return [...prev, cmnt]});
    }

    const handleUserDelete = async () => {
        try {
            const deleted = await axiosPrivate.put(`/comment/${data._id.toString()}`, {user: false, content: 'comment deleted by user'})
            console.log(deleted)
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='comment-item'>
          { (data.user) ? (<h3>{data.user.name}</h3>) : (<h3 className='comment-deleted'>deleted</h3>)}
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
              getComment()
            )}
        { children ? (
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
        ) : (
          (<></>)
        )}
      </div>
    )
}

export default Comment