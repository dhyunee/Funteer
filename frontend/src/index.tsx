import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, createBrowserRouter, RouterProvider, useParams, useSearchParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import reportWebVitals from './reportWebVitals';
import store from './store/store';
/*  */

import UserRoot from './roots/UserRoot';
import AdminRoot from './roots/AdminRoot';
import UserFooterRoot from './roots/UserFooterRoot';
import {
  MainPage,
  SignUp,
  MemberSignUp,
  TeamSignUp,
  FindPassword,
  Login,
  DevTeamPage,
  ServiceDetail,
  FindEmail,
  ResetPassword,
  Charge,
  Donation,
  ErrorPage,
  MyBadges,
  EditProfile,
  MyDonates,
  MyFavors,
  MyFollows,
  MyFunding,
  MyFunteerDonate,
  MyPage,
  AdminMain,
  AdminMember,
  LogOut,
  AdminTeam,
  FundingList,
  CreateFunding,
  AdminTeamDeny,
  AdminFunding,
  CustomerCenter,
  NoticeDetail,
  AdminDonation,
  AdminDonationCreate,
  TeamProfile,
  AdminNotice,
  AdminFaq,
  AdminLive,
  TeamEdit,
  TeamDonation,
} from './pages/index';
import FundingDetail from './pages/Funding/FundingDetail';
import LiveTest from './containers/MyPage/LiveTest';
import { http } from './api/axios';

function Test() {
  const [searchParams, setSearchParams] = useSearchParams();

  const email = searchParams.get('email');
  const data = {
    email,
  };
  const kakaoLogin = async () => {
    try {
      const response = await http.post('login/kakao', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
    } catch (Error) {
      console.log(Error);
    }
  };
  useEffect(() => {
    kakaoLogin();
  }, []);
  return <h1>ㅎㅇㅎㅇㅎㅇ</h1>;
}

const router = createBrowserRouter([
  /** Footer 없는 페이지 */
  {
    path: '/',
    element: <UserRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'login/kakao',
        element: <Test />,
      },
      {
        path: 'findEmail',
        element: <FindEmail />,
      },
      {
        path: 'findPassword',
        element: <FindPassword />,
      },
      {
        path: 'resetPassword',
        element: <ResetPassword />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'signup/team',
        element: <TeamSignUp />,
      },
      {
        path: 'signup/member',
        element: <MemberSignUp />,
      },
      {
        path: 'logout',
        element: <LogOut />,
      },
      {
        path: 'service',
        element: <ServiceDetail />,
      },
      {
        path: 'devteam',
        element: <DevTeamPage />,
      },
      {
        path: '/test',
        element: <LiveTest />,
      },
      {
        path: 'myPage',
        element: <MyPage />,
      },
      {
        path: 'editProfile',
        element: <EditProfile />,
      },
      {
        path: 'myFunding',
        element: <MyFunding />,
      },
      {
        path: 'myFunteerDonate',
        element: <MyFunteerDonate />,
      },
      {
        path: 'myDonates',
        element: <MyDonates />,
      },
      {
        path: 'myBadges',
        element: <MyBadges />,
      },
      {
        path: 'myFavors',
        element: <MyFavors />,
      },
      {
        path: 'myFollow',
        element: <MyFollows />,
      },
      {
        path: 'team/:teamId',
        element: <TeamProfile />,
      },
      {
        path: 'teamedit/:teamId',
        element: <TeamEdit />,
      },
      {
        path: 'teamdonation/:teamId',
        element: <TeamDonation />,
      },
    ],
  },
  /** Footer 있는 페이지 */
  {
    path: '/',
    element: <UserFooterRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'donation',
        element: <Donation />,
      },
      {
        path: 'charge',
        element: <Charge />,
      },
      {
        path: 'charge',
        element: <Charge />,
      },
      {
        path: '/funding',
        element: <FundingList />,
      },
      {
        path: '/funding/create',
        element: <CreateFunding />,
      },
      {
        path: '/funding/detail/:fundIdx',
        element: <FundingDetail />,
      },
      {
        path: '/cc',
        element: <CustomerCenter />,
      },
      {
        path: '/cc/:nn', // nn: 공지사항 번호
        element: <NoticeDetail />,
      },
    ],
  },
  /** 관리자 페이지 */
  {
    path: '/admin',
    element: <AdminRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'main',
        element: <AdminMain />,
      },
      {
        path: 'member',
        element: <AdminMember />,
      },
      {
        path: 'team',
        element: <AdminTeam />,
      },
      {
        path: 'team/deny/:dn', // dn: vms 위촉 번호
        element: <AdminTeamDeny />,
      },
      {
        path: 'funding',
        element: <AdminFunding />,
      },
      {
        path: 'donation',
        element: <AdminDonation />,
      },
      {
        path: 'donation/create',
        element: <AdminDonationCreate />,
      },
      {
        path: 'notice',
        element: <AdminNotice />,
      },
      {
        path: 'faq',
        element: <AdminFaq />,
      },
      {
        path: 'live',
        element: <AdminLive />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const persistor = persistStore(store);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
