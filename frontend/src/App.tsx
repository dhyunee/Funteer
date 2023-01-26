import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Paths } from './paths';
import { MainPage, Login, TeamPage, ServiceDetail, FindEmail, ResetPassword, Charge, SignUp, MemberSignUp, TeamSignUp } from './pages/index';
import Navbar from './components/Navbar';
import ErrorPage from './pages/ErrorPage';

// redux
// eslint-disable-next-line
import { increment, decrement } from './store/slices/counterSlice';
// eslint-disable-next-line
import { useAppDispatch, useAppSelector } from './store/hooks';
import FindPassword from './pages/FindPassword';

function App() {
  return (
    /**
     * path = 이동할 경로 , element = 렌더링할 페이지
     */
    <>
      <Navbar />
      <Routes>
        <Route index element={<MainPage />} />
        <Route path={Paths.signUp.index} element={<SignUp />} />
        <Route path={Paths.signUp.member} element={<MemberSignUp />} />
        <Route path={Paths.signUp.team} element={<TeamSignUp />} />
        <Route path={Paths.team} element={<TeamPage />} />
        <Route path={Paths.service} element={<ServiceDetail />} />
        <Route path={Paths.login} element={<Login />} />
        <Route path={Paths.findEmail.index} element={<FindEmail />} />
        <Route path={Paths.findPassword.index} element={<FindPassword />} />
        <Route path={Paths.findPassword.reset} element={<ResetPassword />} />
        <Route path={Paths.charge} element={<Charge />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
