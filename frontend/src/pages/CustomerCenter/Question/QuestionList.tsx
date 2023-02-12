import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import QuestionContainer from '../../../containers/CustomerCenter/Question/QuestionContainer';
import styles from '../CustomerCenter.module.scss';

function QuestionList() {
  const navigate = useNavigate();

  const goOnNotice = () => {
    navigate('../notice');
  };

  const goOnFAQ = () => {
    navigate('../faq');
  };

  return (
    <div className={styles.page}>
      <div className={styles['tab-contents']}>
        <Box sx={{ width: '100%' }}>
          <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
            <Tabs variant="fullWidth" sx={{ color: 'black' }}>
              <Tab label="공지사항" onClick={goOnNotice} sx={{ fontWeight: 'bold' }} />
              <Tab label="FAQ" onClick={goOnFAQ} sx={{ fontWeight: 'bold' }} />
              <Tab label="1:1 문의" sx={{ fontWeight: 'bold' }} className={styles.indicator} />
            </Tabs>
          </AppBar>
          <QuestionContainer />
        </Box>
      </div>
    </div>
  );
}

export default QuestionList;
