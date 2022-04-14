import client from "@core/api/graphql/graphql-client";
import { TrainingOrderConnection, Query, QueryOrdersArgs } from "@core/api/graphql/types";
import getMyOrdersQueryDocument from "./getMyOrdersQuery.graphql";
import { currentUserId, locale } from "@core/constants";

export default async function getMyOrders(payload?: QueryOrdersArgs): Promise<TrainingOrderConnection> {
  const { data } = await client.query<Required<Pick<Query, "orders">>, QueryOrdersArgs>({
    query: getMyOrdersQueryDocument,
    variables: {
      cultureName: locale,
      userId: currentUserId,
      ...payload,
    },
  });

  return data.orders;
}
