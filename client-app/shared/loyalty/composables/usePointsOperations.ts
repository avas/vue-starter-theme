import { PointsOperationsSearchParams, registerPointsOperation, searchMyPointsOperations } from "@core/api/graphql/loyalty";
import { Logger } from "@core/utilities";
import { InputRegisterPointsOperationType, PointsOperationType, UserType } from "@core/api/graphql/types";
import { MaybeRef } from "@vueuse/core";
import { computed, readonly, ref, Ref, shallowRef, unref } from "vue";

const fallbackItemsPerPage = 20;

const loading: Ref<boolean> = ref(true);
const loadingMore: Ref<boolean> = ref(false);
const pointsOperations: Ref<PointsOperationType[]> = shallowRef([]);
const total: Ref<number> = ref(0);
const pages: Ref<number> = ref(1);

export default (options: { userId: MaybeRef<string>, storeId: MaybeRef<string> }) => {
  const { userId, storeId } = options;

  async function fetchMyPointsOperations(searchParams: Partial<PointsOperationsSearchParams>) {
    loading.value = true;
    pointsOperations.value = [];
    total.value = 0;
    pages.value = 1;

    searchParams.userId = unref(userId);
    searchParams.storeId = unref(storeId);

    try {
      const {
        items = [],
        totalCount = 0,
      } = await searchMyPointsOperations(searchParams);

      pointsOperations.value = items;
      total.value = totalCount;
      pages.value = Math.ceil(totalCount / (searchParams.itemsPerPage || fallbackItemsPerPage));
    } catch (e) {
      Logger.error("usePointsOperations.fetchMyPointsOperations", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMorePointsOperations(searchParams: Partial<PointsOperationsSearchParams>) {
    loadingMore.value = true;

    searchParams.userId = unref(userId);
    searchParams.storeId = unref(storeId);

    try {
      const {
        items = [],
        totalCount = 0,
      } = await searchMyPointsOperations(searchParams);

      pointsOperations.value = pointsOperations.value.concat(items);
      total.value = totalCount;
      pages.value = Math.ceil(totalCount / (searchParams.itemsPerPage || fallbackItemsPerPage));
    } catch (e) {
      Logger.error("usePointsOperations.fetchMorePointsOperations", e);
      throw e;
    } finally {
      loadingMore.value = false;
    }
  }

  async function addPointsOperation(reason: string, amount: number) {
    loading.value = true;

    try {
      const currentUserId = unref(userId);
      const currentStoreId = unref(storeId);

      const createdOperation = await registerPointsOperation(currentUserId, amount, reason, currentStoreId);

      pointsOperations.value.splice(0, 0, createdOperation);
      total.value += 1;
    } catch (e) {
      Logger.error("usePointsOperation.addPointsOperation", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading: readonly(loading),
    loadingMore: readonly(loadingMore),
    pointsOperations: computed(() => pointsOperations.value),
    total: computed(() => total.value),
    pages: computed(() => pages.value),
    fetchMyPointsOperations,
    fetchMorePointsOperations,
    addPointsOperation,
  };
};
