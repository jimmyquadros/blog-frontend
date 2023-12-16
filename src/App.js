import { Routes, Route } from 'react-router';
import { ErrorProvider } from './context/ErrorProvider';
import Register from './components/Register';
import PersistLogin from './components/PersistLogin';
import Header from './components/Header';
import Blog from './components/Blog';
import Profile from './components/Profile';
import Admin from './components/Admin';
import PostEditor from './components/editor/PostEditor';
import RequireAuth from './components/RequireAuth';
import BlogPost from './components/BlogPost';
import ModalWrap from './components/ModalWrap';

function App() {

  return (
    <ModalWrap>
      <Header />
      <div className='main-view'>
        <ErrorProvider top={true}>
          <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/register" element={<Register />}/>
            <Route element={<PersistLogin />} >
              <Route element={<RequireAuth allowedRoles={[1000, 5000, 9000]} />}>
                <Route path="/profile" element={<Profile />}/>
              </Route>
              <Route element={<RequireAuth allowedRoles={[9000, 1000]} />}>
                <Route path="/admin" element={<Admin />}/>
                <Route path="/editor" element={<PostEditor />} />
              </Route>
              <Route path='/:id/:title?' element={<BlogPost />} />
            </Route>
          </Routes>
        </ErrorProvider>
      </div>
    </ModalWrap>
  )
}

export default App;
