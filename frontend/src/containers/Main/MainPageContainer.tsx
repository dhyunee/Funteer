import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useAppSelector } from '../../store/hooks';
import styles from './MainPageContainer.module.scss';
import InfoCard from '../../components/Main/InfoCard';
import FunList from '../../components/Main/funList';
import ast from '../../assets/images/mainPage/ast.png';
import planet from '../../assets/images/mainPage/planet_funteer.png';

export function MainPageContainer() {
  console.log(useAppSelector((state) => state.userSlice.userType));

  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  });

  return (
    <div className={scrollPosition < 700 ? styles.container : styles.container_scrolled}>
      <div style={{ width: '100%', padding: '0 100px' }} className={styles.bannerContainer}>
        {/* <div className={styles.bannerContainer}> */}
        <div className={styles.typoBox}>
          <p className={styles.logoTypo}>
            당신의 착한 마음을 <br /> <span className={styles.logoStrong}>FUNTEER</span>가 응원합니다{' '}
          </p>
          <p className={styles.subLogoTypo}>펀딩을 통해 접하는 새로운 봉사</p>
          <button className={styles.serviceBtn} type="button">
            서비스 상세보기
          </button>
        </div>
        <div className={styles.bannerImg} style={{ opacity: scrollPosition < 700 ? '1' : '0' }}>
          <div className={styles.planets}>
            <img src={planet} alt="planet" className={styles.planet} />
            <div className={styles.astWrap}>
              <img src={ast} alt="ast" className={styles.ast} />
              <img src={ast} alt="ast" className={styles.astCnt} />
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className={styles.infoBanner}>
        <InfoCard />
      </div>
      <div className={styles.fundLists}>
        <FunList />
      </div>
      <div className={styles.volunLists}>1234</div>
      <div className={styles.donate}>1234</div>
    </div>
  );
}

export default MainPageContainer;
