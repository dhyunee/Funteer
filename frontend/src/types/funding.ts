import { string } from 'yargs';

export type FundingElementType = {
  id: number;
  thumbnail: string;
  title: string;
  fundingDescription: string;
  targetAmount: number;
  currentFundingAmount: number;
  startDate: string;
  endDate: string;
  postType: string;
  postDate: string;
};

export interface FundingStatisticType {
  successFundingCount: number;
  totalFundingAmount: number;
  totalFundingCount: number;
}

export interface FundingInterface {
  thumbnail: string;
  title: string;
  fundingDescription: string;
  categoryId: number;
  content: string | undefined;
  startDate: string;
  hashtags: string;
  endDate: string;
  targetMoneyLevelOne: targetMoneyLevelType;
  targetMoneyLevelTwo: targetMoneyLevelType;
  targetMoneyLevelThree: targetMoneyLevelType;
}

export interface FundingReportInterface {
  content: string;
  reportDetailResponseList: responseListType[];
}

export type responseListType = {
  amount: string;
  description: string;
};

export type targetMoneyLevelType = {
  amount: string;
  targetMoneyType: string;
  descriptions: descriptionType[];
};

export type amountLevelType = {
  amount: string;
  descriptions: descriptionType[];
};

export type descriptionType = {
  description: string;
};

// export type commentType ={

// }
