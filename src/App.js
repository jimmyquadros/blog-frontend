import { Routes, Route } from 'react-router';
import Register from './components/Register';
import PersistLogin from './components/PersistLogin';
import Login from './components/Login';
import Header from './components/Header';
import Blog from './components/Blog';
import Profile from './components/Profile';
import Admin from './components/Admin';
import PostEditor from './components/PostEditor';
import RequireAuth from './components/RequireAuth';

function App() {
  
  return (
    <>
      <Header />
      <Routes>

        <Route path="/" element={<Blog />} />
        <Route path="/register" element={<Register />}/>
        <Route element={<PersistLogin />} >
          <Route element={<RequireAuth allowedRoles={[5000, 9000]} />}>
            <Route path="/profile" element={<Profile />}/>
          </Route>
          
          <Route element={<RequireAuth allowedRoles={[9000]} />}>
            <Route path="/admin" element={<Admin />}/>
            <Route path="/editor" element={<PostEditor />} />
          </Route>
          
        </Route>
      </Routes>
    </>
  )
}

export default App;
