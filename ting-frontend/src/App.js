import './App.css';
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import Login from './pages/login/Login.js'


function App() {
let navigate = useNavigate()

  return (
    <div className="App">
      <div className="mainNav">
        <div className='navLeft'>
          <img src="" alt="logo"></img>
          <Link className="navMenu" to="/">메인</Link>
          <Link className="navMenu" to="/tutorial">튜토리얼</Link>
          <Link className="navMenu" to="/community">커뮤니티</Link>
        </div>
        <div className='navRight'>
          <Link className="navMenu" to="/login">로그인</Link>
          <Link className="navMenu" to="/signup">회원가입</Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={ <div>홈!</div> }></Route>
        <Route path="/tutorial" element={ <div>튜토리얼!!</div> }></Route>
        <Route path="/community" element={ <div>커뮤니티</div> }></Route>
        <Route path="/login" element={ <Login/> }></Route>
        <Route path="/signup" element={ <div>회원가입</div> }></Route>
      </Routes>

    </div>
  );
}

export default App;
