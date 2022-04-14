import client from "@core/api/graphql/graphql-client";
import { PointsOperationConnection } from "@core/api/graphql/types";
import { PointsOperationsSearchParams } from "../../types";
import queryDocument from "./searchMyPointsOperationsQuery.graphql";

export default async function searchMyPointsOperations(
  {
    itemsPerPage = 20,
    page = 1,
    userId,
    storeId,
    isDeposit,
    createdSince,
    createdTill,
    sort,
  }: Partial<PointsOperationsSearchParams>
): Promise<PointsOperationConnection> {
  const { data } = await client.query({
    query: queryDocument,
    variables: {
      userId,
      storeId,
      isDeposit,
      createdSince,
      createdTill,
      sort,
      first: itemsPerPage,
      after: String((page - 1) * itemsPerPage),
    },
  });

  return data.pointsOperations;
}
