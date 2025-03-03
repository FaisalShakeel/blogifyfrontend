import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import WriteBlog from './pages/WriteBlog';
import Profile from './pages/Profile';
import BlogsByTag from './pages/BlogsByTag';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/create-account" element={<SignUp/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path="/blog/:id" element={<BlogDetail/>}></Route>
      <Route path='/write-blog' element={<WriteBlog/>}></Route>
      <Route path="/profile/:id" element={<Profile/>}></Route>
      <Route path='/blogs/:tag' element={<BlogsByTag/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
