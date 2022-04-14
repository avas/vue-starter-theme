import client from "@core/api/graphql/graphql-client";
import { PointsOperationType } from "../../../types";
import mutationDocument from "./registerPointsOperationMutation.graphql"

export default async function registerPointsOperation(userId: string, amount: number, reason: string, storeId?: string): Promise<PointsOperationType> {
  const { data } = await client.mutate({
    mutation: mutationDocument,
    variables: {
      command: {
        userId,
        storeId,
        amount,
        reason,
      },
    },
  });

  return data.registerPointsOperation;
}
