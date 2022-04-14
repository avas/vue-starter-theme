import { getMyUserBalance } from "@core/api/graphql/loyalty";
import { UserBalanceType, UserType } from "@core/api/graphql/types";
import { Logger } from "@core/utilities";
import { MaybeRef } from "@vueuse/core";
import { computed, readonly, ref, Ref, unref } from "vue";

const emptyUserBalance = readonly({
  id: "",
  createdDate: null,
  userId: "",
  amount: 0,
});

const loading: Ref<boolean> = ref(true);
const myUserBalance: Ref<UserBalanceType> = ref(emptyUserBalance);

export default (options: { userId: MaybeRef<string>, storeId: MaybeRef<string> }) => {
  const { userId, storeId } = options;

  async function loadMyUserBalance(includePointsOperations: boolean) {
    loading.value = true;

    try {
      myUserBalance.value = await getMyUserBalance(unref(userId), includePointsOperations, unref(storeId)) ?? emptyUserBalance;
    } catch (e) {
      Logger.error("useUserBalance.loadMyUserBalance", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading: readonly(loading),
    myUserBalance: computed(() => myUserBalance.value),
    loadMyUserBalance,
  };
};
