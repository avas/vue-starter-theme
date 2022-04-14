import client from "@core/api/graphql/graphql-client";
import { UserBalanceType } from '@core/api/graphql/types';
import queryDocument from "./getMyUserBalanceQuery.graphql";

export default async function getMyUserBalance(userId: string, includePointsOperations: boolean, storeId?: string): Promise<UserBalanceType> {
  const { data } = await client.query({
    query: queryDocument,
    variables: {
      userId,
      storeId,
      includePointsOperations,
    },
  });

  return data.userBalance;
}
