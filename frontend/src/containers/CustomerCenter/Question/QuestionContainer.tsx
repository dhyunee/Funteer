import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import QuestionContainerItem from './QuestionContainerItem';
import styles from './QuestionContainer.module.scss';

export default function QuestionContainer() {
  const navigate = useNavigate();

  const [createMode, setCreateMode] = useState<boolean>(false);

  const onClickCreateQuesBtnHandler = () => {
    setCreateMode(true);
  };

  const onClickCancelBtnHandler = () => {
    setCreateMode(false);
  };

  const onClickPostBtnHandler = () => {
    console.log('문의 등록 요청');
    setCreateMode(false);
  };

  return (
    <div className={styles.container}>
      {/* 문의 목록 */}
      {!createMode && (
        <div className={styles['ques-board']}>
          <div className={styles['ques-btn-div']}>
            <Button variant="outlined" className={styles['ques-btn']} onClick={onClickCreateQuesBtnHandler}>
              문의하기
            </Button>
          </div>
          <div>
            {QuestionContainerItem.map((data) => (
              <Accordion sx={{ boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <div>
                    <Typography sx={{ fontSize: '1.125rem' }}>{data.ques}</Typography>
                    <p className={styles.state}>{data.state}</p>
                  </div>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'rgb(255, 254, 253)', padding: '2rem', boxShadow: '0px 0px 20px rgba(255, 132, 0, 0.02) inset' }}>
                  <Typography sx={{ fontSize: '1rem', lineHeight: '2rem' }}>{data.ans}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      )}
      {/* 문의 생성 */}
      {createMode && (
        <div className={styles['ques-create']}>
          <div className={styles['title-label']}>
            <p>제목</p>
          </div>
          <TextField id="standard-basic" variant="standard" color="warning" className={styles['title-input']} />
          <div className={styles['content-label']}>
            <p>내용</p>
          </div>
          <TextField id="outlined-multiline-static" multiline rows={10} color="warning" className={styles['content-input']} />
          <div className={styles['submit-btn-div']}>
            <Button variant="contained" onClick={onClickCancelBtnHandler}>
              취소
            </Button>
            <Button variant="contained" onClick={onClickPostBtnHandler}>
              등록
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}