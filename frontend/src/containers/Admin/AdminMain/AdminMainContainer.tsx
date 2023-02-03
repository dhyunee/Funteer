import React from 'react';
import styles from './AdminMainContainer.module.scss';

function AdminMainContainer() {
  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <h1>FUNTEER 관리자 페이지입니다.</h1>
        <h2>문의사항은 abcd1234@gmail.com으로 연락해주세요.</h2>
      </div>
    </div>
  );
}

export default AdminMainContainer;
