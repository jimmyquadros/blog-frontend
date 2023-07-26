import useAuth from '../hooks/useAuth';

const Blog = () => {

    const { auth } = useAuth();
    
    return (
        <div className='blog-area'>
            <div>
                <h1>BLOG AREA</h1>
                { auth ? (<h2>logged in</h2>) : (<></>)}
            </div>
        </div>
    )
}

export default Blog;