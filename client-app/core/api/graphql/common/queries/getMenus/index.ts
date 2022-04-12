import client from "@core/api/graphql/graphql-client";
import { MenuLinkListType } from "@core/api/graphql/types";
import { storeId } from "@core/constants";
import getMenusQueryDocument from "./getMenus.graphql";

export default async function getMenus(cultureName: string): Promise<MenuLinkListType[]> {
  const { data } = await client.query({
    query: getMenusQueryDocument,
    variables: {
      storeId: storeId,
      cultureName,
    },
  });

  return data?.menus;
}
