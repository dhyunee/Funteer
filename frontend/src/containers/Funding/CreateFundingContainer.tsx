import React, { useState, useRef, useEffect, useMemo} from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import dayjs, { Dayjs } from 'dayjs';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import DatePicker from 'react-date-picker';
import styles from './CreateFundingContainer.module.scss';
import { requestCreateFunding, requestUploadImage } from '../../api/funding';
import { FundingInterface } from '../../types/funding';
import defaultThumbnail from '../../assets/images/default-profile-img.svg';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { openModal } from '../../store/slices/modalSlice';
import requiredIcon from '../../assets/images/funding/required.svg';
import uploadIcon from '../../assets/images/funding/upload.svg';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css'
import './CalendarCustom.css'
import './DatePickerCustom.css'
import { diffDay, diffDayOfStartEnd } from '../../utils/day';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

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
    amount1: 0,
    description1: '',
    amount2: 0,
    description2: '',
    amount3: 0,
    description3: '',
  });
  const [thunmbnailPreview, setThumbnailPreview] = useState<string>();
  const [progress, setProgress] = useState<number>(100 / 3);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [startDate,setStartDate] = useState(new Date())
  const [endDate,setEndDate] = useState(new Date())

  const allFundingDays = useMemo(()=>diffDayOfStartEnd(startDate,endDate),[startDate,endDate])

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

  const onChangeTextHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFundingData({ ...fundingData, [name]: value });
  };

  const onChangeDateHandler = (value: Dayjs | null, type: string) => {
    const date = value?.format('YYYY-MM-DD');
    setFundingData({ ...fundingData, [type]: date });
  };

  const handleModal = () => {
    navigate(-1);
  };

  const onCreateFunding = async () => {
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

  // useEffect(() => {
  //   console.log(fundingData);
  // }, [fundingData]);

  useEffect(()=>{
console.log(startDate , endDate);
console.log(typeof startDate);


  },[startDate,endDate])




  return (
    <div className={styles.container}>
      <div className={styles.contents}>
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
              <input ref={thumbnailRef} type="file" accept="image/*" onChange={onFileHandler} className={styles['thumbnail-upload-input']} />
            </div>
          </div>
        </div>
        <div className={styles['funding-title-box']}>
          <p className={styles.title}>
            펀딩 제목 <img className={styles.required} src={requiredIcon} alt="" />
          </p>
          <input type="text" name="title" className={styles['input-text']} onChange={onChangeTextHandler} placeholder="제목을 입력해주세요" />
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

          {/* <Calendar/> */}
          <div className={styles['date-picker-box']}>
            <div className={styles['date-picker']}>
            <p className={styles.subTitle}>펀딩 시작 일자를 선택해주세요.</p>
          <DatePicker onChange={setStartDate} value={startDate}    />
          </div>
           <div className={styles['date-picker']}>
            <p className={styles.subTitle}>펀딩 종료 일자를 선택해주세요.</p>
            <DatePicker onChange={setEndDate} value={endDate} />
           </div>
           </div>
           <p>총 {allFundingDays}일간 펀딩을 진행합니다.</p>
        </div>

        <div className={styles['funding-amount-box']}>
          <p className={styles.title}>펀딩 단계별 활동 설정  <img className={styles.required} src={requiredIcon} alt="" /></p>

          <div className={styles['progress-box']}>
            <div className={styles['stage-text-box']}>
              <p className={styles.subTitle}>시작</p>
              <p className={styles.subTitle}>최소 기준</p>
              <p className={styles.subTitle}>추가 모금 1단계 </p>
              <p className={styles.subTitle}>추가 모금 2단계</p>
            </div>
            <LinearProgress sx={{height:6,borderRadius:2}} variant="determinate" value={progress}   color="warning"/>

            <TabPanel value={0} index={tabIdx}>
              <div className={styles['stage-contents-box']}>
                <p>목표 금액</p>
                <input type="number" value={fundingData.amount1} placeholder="금액을 입력해주세요" name="amount1" className={styles['money-input']} onChange={onChangeTextHandler} />
                <textarea placeholder="내용을 입력해주세요" value={fundingData.description1} className={styles['contents-textarea']} name="description1" onChange={onChangeTextHandler} />
              </div>
            </TabPanel>

            <TabPanel value={1} index={tabIdx}>
              <div className={styles['stage-contents-box']}>
                <input type="number" placeholder="금액을 입력해주세요" value={fundingData.amount2} className={styles['money-input']} name="amount2" onChange={onChangeTextHandler} />
                <textarea placeholder="내용을 입력해주세요" value={fundingData.description2} className={styles['contents-textarea']} name="description2" onChange={onChangeTextHandler} />
              </div>
            </TabPanel>

            <TabPanel value={2} index={tabIdx}>
              <div className={styles['stage-contents-box']}>
                <input type="number" placeholder="금액을 입력해주세요" value={fundingData.amount3} className={styles['money-input']} name="amount3" onChange={onChangeTextHandler} />
                <textarea placeholder="내용을 입력해주세요" value={fundingData.description3} className={styles['contents-textarea']} name="description3" onChange={onChangeTextHandler} />
              </div>
            </TabPanel>
            <div className={styles['stage-button-box']}>
              <button type="button" onClick={prevStageHandler}>
                이전 단계
              </button>

              <button type="button" onClick={nextStageHandler}>
                다음 단계
              </button>
            </div>
          </div>
          <button type="button" onClick={onCreateFunding}>
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFundingContainer;
