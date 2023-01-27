import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';

type adminSideBarDataType = {
  title: string;
  path: string;
  icon: React.ReactNode;
};

export const AdminSideBarItem: adminSideBarDataType[] = [
  {
    title: '관리자 홈',
    path: 'tmp',
    icon: <AiIcons.AiFillHome color="white" />,
  },
  {
    title: '개인 회원관리',
    path: 'tmp',
    icon: <BsIcons.BsPersonFill color="white" />,
  },
  {
    title: '단체 회원관리',
    path: 'tmp',
    icon: <RiIcons.RiTeamFill color="white" />,
  },
  {
    title: '펀딩 관리',
    path: 'tmp',
    icon: <BiIcons.BiReceipt color="white" />,
  },
  {
    title: '자체 기부 관리',
    path: 'tmp',
    icon: <FaIcons.FaMoneyBillWave color="white" />,
  },
  {
    title: '공지사항 관리',
    path: 'tmp',
    icon: <AiIcons.AiFillExclamationCircle color="white" />,
  },
  {
    title: 'FAQ 관리',
    path: 'tmp',
    icon: <AiIcons.AiFillQuestionCircle color="white" />,
  },
  {
    title: '라이브 관리',
    path: 'tmp',
    icon: <BsIcons.BsBroadcastPin color="white" />,
  },
];

export default AdminSideBarItem;
