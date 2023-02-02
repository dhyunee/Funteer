import React, { useState, useRef, useEffect, useMemo } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import dayjs, { Dayjs } from 'dayjs';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Icon, IconButton, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import RoomIcon from '@mui/icons-material/Room';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles';
import { fontWeight } from '@mui/system';
import styles from './CreateFundingContainer.module.scss';
import { requestCreateFunding, requestUploadImage } from '../../api/funding';
import { FundingInterface, amountLevelType, descriptionType } from '../../types/funding';
import defaultThumbnail from '../../assets/images/default-profile-img.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openModal } from '../../store/slices/modalSlice';
import requiredIcon from '../../assets/images/funding/required.svg';
import uploadIcon from '../../assets/images/funding/upload.svg';
import { diffDayStartToEnd } from '../../utils/day';
import { stringToSeparator,stringToNumber } from '../../types/convert';
import TabPanel from '../../components/Funding/TabPanel';
import TabContent from '../../components/Funding/TabContent';


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
  [`& .title`]:{
   fontSize:"15px",
   fontWeight:"bold"
  }
}));

function CreateFundingContainer() {
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editorRef = useRef<ToastEditor>(null);
  const [fundingData, setFundingData] = useState<FundingInterface>({
    thumbnail: new Blob(),
    title: '',
    fundingDescription: '',
    categoryId: 1,
    content: '',
    startDate: '',
    endDate: '',
    hashtags: '#tags',
    LEVEL_ONE: {
      amount: '',
      descriptions: [],
    },
    LEVEL_TWO: {
      amount: '',
      descriptions: [],
    },
    LEVEL_THREE: {
      amount: '',
      descriptions: [],
    },
  });
  const [thunmbnailPreview, setThumbnailPreview] = useState<string>();
  const [progress, setProgress] = useState<number>(100 / 3);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [todoText, setTodoText] = useState<string>('');

  const allFundingDays = useMemo(() => diffDayStartToEnd(fundingData.startDate, fundingData.endDate), [fundingData.startDate, fundingData.endDate]);

  const editorChangeHandler = (e: any) => {
    const text = editorRef.current?.getInstance().getHTML();

    setFundingData({ ...fundingData, content: text });
  };

  const onUploadImage = async (blob: Blob, callback: any) => {
    console.log(blob);

    const url = await requestUploadImage(blob);

    callback(url, 'fundingContents이미지');
  };

  const prevStageHandler = () => {
    if (progress > 100 / 3) {
      setProgress(progress - 100 / 3);
      setTabIdx(tabIdx - (1 % 3));
    }
  };
  const nextStageHandler = () => {
    if (progress < 100) {
      setProgress(progress + 100 / 3);
      setTabIdx(tabIdx + (1 % 3));
    }
  };

  const onFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    setFundingData({ ...fundingData, thumbnail: file });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
  };

  // 목표 금액 Handler
  const onChangeTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 금액 입력중 숫자외의 문자가 들어오면 제거
    const regex = /[^0-9]/g
    const separatorValue = stringToSeparator(value.replaceAll(regex,""))
    switch (name) {
      case "title":
        setFundingData({...fundingData,title:value})
        break;
      case "fundingDescription":
        setFundingData({...fundingData,fundingDescription:value})
        break;
      case 'LEVEL_ONE':
        
     
        setFundingData({ ...fundingData, LEVEL_ONE: { ...fundingData.LEVEL_ONE, amount: separatorValue } });
        break;
      case 'LEVEL_TWO':
        setFundingData({ ...fundingData, LEVEL_TWO: { ...fundingData.LEVEL_TWO, amount: separatorValue } });
        break;
      case 'LEVEL_THREE':
        setFundingData({ ...fundingData, LEVEL_THREE: { ...fundingData.LEVEL_THREE, amount: separatorValue } });
        break;
      default:
        break;
    }
  };

  // 해야할일 input 관리
  const onChangeTodoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };

  const onChangeDateHandler = (value: Dayjs | null, type: string) => {
    const date = value?.format('YYYY-MM-DD');
    setFundingData({ ...fundingData, [type]: date });
  };

  const handleModal = () => {
    navigate(-1);
  };

  const onCreateFunding = async () => {

    console.log(fundingData);
    try {
      const response = await requestCreateFunding(fundingData);
      if (response.status === 200) {
        dispatch(openModal({ isOpen: true, title: '펀딩 생성 성공', content: '펀딩 생성에 성공했습니다.', handleModal }));
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickUpload = () => {
    if (thumbnailRef.current) thumbnailRef.current.click();
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>,level:string) => {
    if (e.key === 'Enter') addTodos(level);
  };
  const addTodos = (level: string) => {
    
    let prev;
    const todo ={ description : todoText}
    // eslint-disable-next-line default-case
    switch(level){
      case "LEVEL_ONE":
        prev = fundingData.LEVEL_ONE.descriptions
        setFundingData({...fundingData,LEVEL_ONE:{...fundingData.LEVEL_ONE,descriptions:[...prev,todo]}})
        break;
        case 'LEVEL_TWO':
          prev = fundingData.LEVEL_TWO.descriptions
          setFundingData({...fundingData,LEVEL_TWO:{...fundingData.LEVEL_TWO,descriptions:[...prev,todo]}})
        break;
      case "LEVEL_THREE":
        prev = fundingData.LEVEL_THREE.descriptions
        setFundingData({...fundingData,LEVEL_THREE:{...fundingData.LEVEL_THREE,descriptions:[...prev,todo]}})
      break;
      default:
        break;
    }

    setTodoText("")
  };

  useEffect(()=>{

    const htmlString = `  
    <h1>프로젝트 소개</h1>
    <p>프로젝트를 간단히 소개한다면?</p> 
    <p>이 프로젝트를 하면 어떤 효과를 발생시키나요?</p> 
    <p>이 프로젝트를 시작하게 된 배경이 무엇인가요 ?</p>

    <h1>프로젝트 예산</h1>
    <p>펀딩으로 모금된 금액을 어디에 사용 예정인지 구체적으로 지출 항목으로 적어 주세요.</p>
    <ul>
    <li>구체적인 항목으로 적어주세요.</li>
    </ul>
    <h1>프로젝트 일정</h1>
    <p>아래의 양식을 참고하여 작성해보세요.</>
    <ul>
    <li>0월 0일: 봉사활동 계획</li>
    <li>0월 0일: 봉사활동 실행</li>
    </ul>

    `
    editorRef.current?.getInstance().setHTML(htmlString);
  },[])

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <form>
        <div className={styles['funding-thumbnail-box']}>
          <p className={styles.title}>
            프로젝트 대표 이미지 <img className={styles.required} src={requiredIcon} alt="" />
          </p>
          <p className={styles.subTitle}>후원자들이 프로젝트의 내용을 쉽게 파악할 수 있는 이미지를 올려주세요.</p>
          <div className={styles['thumbnail-upload-box']}>
            <img src={thunmbnailPreview || defaultThumbnail} alt="thumbnail" className={styles['thumbnail-image']} />

            <div className={styles['upload-button-box']} onClick={onClickUpload} aria-hidden="true">
              <p className={styles['upload-icon-box']}>
                <img className={styles['upload-icon']} src={uploadIcon} alt="업로드 아이콘" /> 이미지 업로드{' '}
              </p>
              <p className={styles.subDescription}>파일 형식은 jpg 또는 png로 업로드 해주세요. </p>
              <p className={styles.subDescription}>
                <span>
                  {' '}
                  이미지를 등록하면 즉시 반영됩니다. <br />
                </span>
              </p>
              <input ref={thumbnailRef} type="file" accept="image/*" onChange={onFileHandler} className={styles['thumbnail-upload-input']}  required/>
            </div>
          </div>
        </div>
        <div className={styles['funding-title-box']}>
          <p className={styles.title}>
            펀딩 제목 <img className={styles.required} src={requiredIcon} alt="" />
          </p>
          <input type="text" name="title" className={styles['input-text']} onChange={onChangeTextHandler} placeholder="제목을 입력해주세요"  required/>
        </div>

        <div className={styles['funding-description-box']}>
          <p className={styles.title}>
            펀딩 요약 설명 <img className={styles.required} src={requiredIcon} alt="" />
          </p>
          <input
            type="text"
            name="fundingDescription"
            onChange={onChangeTextHandler}
            className={styles['input-text']}
            placeholder="진행하는 펀딩에 대해 간단히 설명해 주세요."
            required
          />
        </div>

        <div className={styles['funding-contents-box']}>
          <p className={styles.title}>
            펀딩 내용 <img className={styles.required} src={requiredIcon} alt="" />
          </p>
          <ToastEditor
            ref={editorRef}
            placeholder="진행하시는 펀딩에 대해 자세히 설명해주세요."
            height="500px"
            useCommandShortcut
            initialEditType="wysiwyg"
            onChange={editorChangeHandler}
            hooks={{ addImageBlobHook: onUploadImage }}
            language="ko-KR"
            hideModeSwitch // 하단의 타입 선택 탭 숨기기
            
          />
        </div>

        <div className={styles['funding-date-box']}>
          <p className={styles.title}>
            펀딩 기간 설정 <img className={styles.required} src={requiredIcon} alt="" />
          </p>

          <div className={styles['date-picker-box']}>
            <LocalizationProvider dateAdapter={AdapterDayjs}   required>
              <DatePicker

                disablePast
                label="펀딩 시작 일자를 선택해주세요"
                inputFormat="YYYY-MM-DD"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  onChangeDateHandler(newValue, 'startDate');
                }}
                renderInput={(params) => <TextField {...params} sx={{ mr: 2, mb: 5, minWidth: 300 }} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}  required>
              <DatePicker
             
                disablePast
                label="펀딩 종료 일자를 선택해주세요"
                minDate={startDate}
                inputFormat="YYYY-MM-DD"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                  onChangeDateHandler(newValue, 'endDate');
                }}
                renderInput={(params) => <TextField {...params} sx={{ minWidth: 300 }} />}
              />
            </LocalizationProvider>
          </div>

          {allFundingDays > 0 ? (
            <p className={styles['funding-days-text']}>총 {allFundingDays}일간 펀딩을 진행합니다.</p>
          ) : (
            <p className={styles['funding-days-text']}>시작 일자와 종료 일자를 선택해주세요.</p>
          )}
        </div>

        <div className={styles['funding-amount-box']}>
          <p className={styles.title}>
            펀딩 단계별 활동 설정 <img className={styles.required} src={requiredIcon} alt="" />
          </p>

          <div className={styles['progress-box']}>
            <div className={styles['stage-text-box']}>
              <Tooltip title="asdas" placement='top'>
              <Icon fontSize="large"> <RoomIcon   fontSize="large" sx={{color:'rgba(236, 153, 75, 1)'}}/></Icon>
              </Tooltip>
            
              <HtmlTooltip
              placement='top'
                  title={
                    <>
                    <p className='title'>최소 달성조건</p>
                    {fundingData?.LEVEL_ONE.descriptions[0]}
                    </>
                   }
                  > 
              <Icon fontSize="large"> <RoomIcon  fontSize="large" sx={tabIdx >=0?{color:"rgba(236, 153, 75, 1)"}:{color:"rgb(109, 109, 109);"}}/></Icon>
              </HtmlTooltip>

              <HtmlTooltip
              placement='top'
                  title={
                    <p className='title'>1단계 초과달성 </p>
                   }
                  > 
              <Icon fontSize="large"> <RoomIcon fontSize="large" sx={tabIdx >=1?{color:"rgba(236, 153, 75, 1)"}:{color:"rgb(109, 109, 109);"}}/></Icon>
              </HtmlTooltip>

              <HtmlTooltip
              placement='top'
                  title={
                    <p className='title'>2단계 초과달성 </p>
                   }
                  > 
              <Icon fontSize="large"> <RoomIcon fontSize="large" sx={tabIdx >=2?{color:"rgba(236, 153, 75, 1)"}:{color:"rgb(109, 109, 109);"}}/></Icon>
              </HtmlTooltip>
        
            </div>
            <LinearProgress sx={{ height: 15, borderRadius: 2 }} variant="determinate" value={progress} color="warning" />

            <TabPanel value={0} index={tabIdx}>
              <TabContent
                data={fundingData.LEVEL_ONE}
                onChangeTextHandler={onChangeTextHandler}
                onChangeTodoHandler={onChangeTodoHandler}
                onKeyDownHandler={onKeyDownHandler}
                addTodos={addTodos}
                level="LEVEL_ONE"
                todoText={todoText}
              />
            </TabPanel>

            <TabPanel value={1} index={tabIdx}>
              <TabContent
                data={fundingData.LEVEL_TWO}
                onChangeTextHandler={onChangeTextHandler}
                onChangeTodoHandler={onChangeTodoHandler}
                onKeyDownHandler={onKeyDownHandler}
                addTodos={addTodos}
                level="LEVEL_TWO"
                todoText={todoText}

              />
            </TabPanel>

            <TabPanel value={2} index={tabIdx}>
              <TabContent
                data={fundingData.LEVEL_THREE}
                onChangeTextHandler={onChangeTextHandler}
                onChangeTodoHandler={onChangeTodoHandler}
                onKeyDownHandler={onKeyDownHandler}
                addTodos={addTodos}
                level="LEVEL_THREE"
                todoText={todoText}
              />
            </TabPanel>
            <div className={styles['stage-button-box']}>
              <Button className={styles['stage-button']} type="button" onClick={prevStageHandler} variant="outlined" startIcon={<ArrowBackOutlinedIcon />}>
                이전 단계
              </Button>

              <Button className={styles['stage-button']} type="button" onClick={nextStageHandler} endIcon={<ArrowForwardOutlinedIcon />}>
                다음 단계
              </Button>
            </div>
          </div>
          <Button variant="contained" type="submit" className={styles['submit-button']} color="warning" onClick={onCreateFunding}>
            펀딩 생성하기
          </Button>
        </div>
  
        </form>
      </div>
    </div>
  );
}

export default CreateFundingContainer;
