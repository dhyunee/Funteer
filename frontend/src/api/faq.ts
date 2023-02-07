import { FaqInterface } from '../types/faq';
import { http } from './axios';


/**
 * faq 생성 API
 * @method POST
 * @param {FaqInterface} faqData
 */

export const requestCreateFaq = async (faqData: FaqInterface) => {
  const formData = new FormData();
  const entry = Object.entries(faqData);

  entry.forEach((data) => {
    const key = data[0];
    const value = data[1];
    formData.append(`${key}`, value);
  });
  
  const res = await http.post('faq', JSON);
  return res;
};


/** faq 수정 API */
export const requestModifyFaq = async (faqIdx:number, faqData: FaqInterface) => {
  const formData = new FormData();
  const entry = Object.entries(faqData);

  entry.forEach((data) => {
    const key = data[0];
    const value = data[1];
    formData.append(`${key}`, value);
  });
  
  const res = await http.put(`admin/faq/${faqIdx}`, formData);
  return res;
};




/**
 * faq 리스트 호출 API
 * @method GET
 */

export const requestFaqList = async () => {
  const res = await http.get('faq');
  console.log(res);

  return res;
};



export const requestAdminFaqList = async (size: number) => {
  const res = await http.get(`admin/faq?size=${size}`);
  console.log(res);

  return res;
};


/**
 * @name 다음 faq리스트호출
 * @returns
 */
export const requestNextAdminFaqList = async (currentPage: number, size: number) => {
  console.log(currentPage, size);

  const response = await http.get(`admin/faq/?page=${currentPage + 1}&size=${size}`);
  return response;
};

/*
 * faq 상세 호출
 * @method GET
 */

export const requestFaqDetail = async (faqIdx?: number) => {
  const res = await http.get(`faq/${faqIdx}`);
  console.log(res);
  return res;
};
