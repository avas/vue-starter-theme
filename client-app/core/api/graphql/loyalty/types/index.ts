import { number } from "yup";

export type PointsOperationsSearchParams = {
  page: number;
  itemsPerPage: number;
  userId: string;
  storeId?: string;
  isDeposit?: boolean;
  createdSince?: Date;
  createdTill?: Date;
  sort: string;
};
