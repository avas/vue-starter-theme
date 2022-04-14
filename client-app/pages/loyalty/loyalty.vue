<template>
  <div class="bg-gray-100 flex-grow pt-6 pb-16 shadow-inner">
    <div class="max-w-screen-2xl md:px-12 mx-auto">
      <div class="flex lg:space-x-5">
        <!-- First column-->
        <div class="hidden lg:flex flex-col lg:w-1/5 space-y-5">
          <AccountNavigation></AccountNavigation>
        </div>

        <!-- Second column-->
        <div class="flex flex-col w-full lg:w-4/5 space-y-5">
          <div class="flex flex-col">
            <VcCard :title="$t('pages.loyalty.points_operations.balance_card.title')">
              <div class="flex" v-if="userBalanceLoading">
                <span class="h-10 w-64 bg-gray-200 animate-pulse"></span>
              </div>
              <div class="flex gap-2" v-else>
                <span class="text-4xl font-extrabold">{{ myUserBalance.amount }}</span>
                <span class="text-4xl left-10">
                  {{ $t("pages.loyalty.points_operations.balance_card.points_label", myUserBalance.amount) }}</span
                >
              </div>
            </VcCard>
          </div>

          <div class="flex justify-between items-center mx-5 lg:mx-0">
            <h2 class="text-gray-800 text-3xl font-bold uppercase">{{ title }}</h2>

            <VcButton v-if="!editingMode" class="px-3 uppercase border" size="sm" is-outline @click="openEditMode()">
              {{
                isMobile
                  ? $t("pages.loyalty.points_operations.operations_list.add_new_operation_button_mobile")
                  : $t("pages.loyalty.points_operations.operations_list.add_new_operation_button")
              }}
            </VcButton>
          </div>

          <div class="flex flex-col mx-5 lg:mx-0">
            <VcCheckbox v-model="infiniteScrollEnabled" @change="onScrollModeChange()">
              {{ $t("pages.loyalty.points_operations.operations_list.use_infinite_scrolling") }}
            </VcCheckbox>
          </div>

          <div class="flex flex-col bg-white shadow-sm" :class="{ 'rounded border': !isMobile }">
            <PointsOperationForm
              v-if="editingMode"
              :model-value="newOperation"
              :disabled="saveOperationLoading"
              class="px-6 py-4"
              @save="saveOperation"
            >
              <template #append="{ dirty }">
                <div class="flex space-x-4 pb-3 pt-7 sm:pb-4 sm:pt-4 sm:float-right">
                  <VcButton
                    kind="secondary"
                    :size="isMobile ? 'md' : 'lg'"
                    :is-disabled="saveOperationLoading"
                    class="uppercase w-32 sm:w-auto sm:px-12"
                    is-outline
                    @click="closeEditMode"
                    v-t="'pages.loyalty.points_operations.operations_list.cancel_button'"
                  >
                  </VcButton>

                  <VcButton
                    :size="isMobile ? 'md' : 'lg'"
                    :is-disabled="!dirty"
                    :is-waiting="saveOperationLoading"
                    class="uppercase flex-grow sm:flex-none sm:px-16"
                    is-submit
                  >
                    {{ $t("pages.loyalty.points_operations.operations_list.create_button") }}
                  </VcButton>
                </div>
              </template>
            </PointsOperationForm>

            <!-- View Table -->
            <template v-else>
              <VcTable
                :loading="pointsOperationsLoading"
                :columns="columns"
                :items="pointsOperations"
                :pages="infiniteScrollEnabled ? 1 : pages"
                :page="page"
                @pageChanged="onPageChange"
              >
                <template #mobile-item="itemData">
                  <div class="grid grid-cols-2 p-6 gap-y-4 border-b border-gray-200">
                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.created_date_label'"
                      ></span>
                      <span class="pr-4 font-extrabold overflow-hidden overflow-ellipsis">
                        {{ formatDate(itemData.item.createdDate) }}
                      </span>
                    </div>

                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.amount_label'"
                      ></span>
                      <span
                        class="overflow-hidden overflow-ellipsis"
                        :class="itemData.item.amount > 0 ? 'addition' : 'deposit'"
                        >{{
                          $t("pages.loyalty.points_operations.operations_list.points", itemData.item.amount, {
                            n: itemData.item.amount,
                          })
                        }}</span
                      >
                    </div>

                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.reason_label'"
                      ></span>
                      <span class="pr-4 overflow-hidden overflow-ellipsis">
                        {{ itemData.item.reason }}
                      </span>
                    </div>

                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.balance_label'"
                      ></span>
                      <span class="overflow-hidden overflow-ellipsis">{{
                        $t("pages.loyalty.points_operations.operations_list.points", itemData.item.balance, {
                          n: itemData.item.balance,
                        })
                      }}</span>
                    </div>
                  </div>
                </template>
                <template #mobile-empty>
                  <div class="flex items-center justify-center space-x-10 p-5">
                    <img
                      src="/static/images/loyalty/icons/no-points-operations.svg"
                      :alt="$t('pages.loyalty.points_operations.no_operations_img_alt')"
                    />
                    <div class="flex flex-col space-y-2">
                      <span
                        class="text-base"
                        v-t="'pages.loyalty.points_operations.operations_list.no_operations_message'"
                      ></span>
                      <VcButton
                        class="uppercase w-full"
                        @click="openEditMode()"
                        v-t="'pages.loyalty.points_operations.add_new_operation_button'"
                      ></VcButton>
                    </div>
                  </div>
                </template>
                <template #mobile-skeleton>
                  <div v-for="i of itemsPerPage" :key="i" class="grid grid-cols-2 p-6 gap-y-4 border-b border-gray-200">
                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.created_date_label'"
                      ></span>
                      <div class="h-5 mr-4 bg-gray-200 animate-pulse"></div>
                    </div>

                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.amount_label'"
                      ></span>
                      <div class="h-5 mr-4 bg-gray-200 animate-pulse"></div>
                    </div>

                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.reason_label'"
                      ></span>
                      <div class="h-5 bg-gray-200 animate-pulse"></div>
                    </div>

                    <div class="flex flex-col">
                      <span
                        class="text-sm text-gray-400"
                        v-t="'pages.loyalty.points_operations.operations_list.balance_label'"
                      ></span>
                      <div class="h-5 bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                </template>
                <template #desktop-body>
                  <tr v-for="operation in pointsOperations" :key="operation.id" class="even:bg-gray-50">
                    <td class="p-5 overflow-hidden overflow-ellipsis">
                      {{ formatDate(operation.createdDate) }}
                    </td>
                    <td class="p-5 w-1/2 overflow-hidden overflow-ellipsis">
                      {{ operation.reason }}
                    </td>
                    <td
                      class="p-5 overflow-hidden overflow-ellipsis"
                      :class="operation.amount > 0 ? 'addition' : 'deposit'"
                    >
                      {{
                        $t("pages.loyalty.points_operations.operations_list.points", operation.amount, {
                          n: operation.amount,
                        })
                      }}
                    </td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">
                      {{
                        $t("pages.loyalty.points_operations.operations_list.points", operation.balance, {
                          n: operation.balance,
                        })
                      }}
                    </td>
                  </tr>
                </template>
                <template #desktop-empty>
                  <!-- Workaround for using colspan -->
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="4" class="polygons-bg">
                      <div class="flex items-center pl-56 space-x-10 h-80">
                        <img
                          src="/static/images/loyalty/icons/no-points-operations.svg"
                          :alt="$t('pages.loyalty.points_operations.no_operations_img_alt')"
                        />
                        <div class="flex flex-col space-y-2">
                          <span
                            class="text-base"
                            v-t="'pages.loyalty.points_operations.operations_list.no_operations_message'"
                          ></span>
                          <VcButton
                            class="uppercase w-full"
                            @click="openEditMode()"
                            v-t="'pages.loyalty.points_operations.operations_list.add_new_operation_button'"
                          ></VcButton>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
                <template #desktop-skeleton>
                  <tr v-for="i of itemsPerPage" :key="i" class="even:bg-gray-50">
                    <td class="p-5">
                      <div class="h-5 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="w-1/2 p-5">
                      <div class="h-5 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="p-5">
                      <div class="h-5 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td class="p-5">
                      <div class="h-5 bg-gray-200 animate-pulse"></div>
                    </td>
                  </tr>
                </template>
              </VcTable>

              <VcInfinityScrollLoader
                class="my-6"
                v-if="infiniteScrollEnabled && !pointsOperationsLoading"
                :loading="morePointsOperationsLoading"
                distance="400"
                @visible="loadMoreOperations"
              ></VcInfinityScrollLoader>
              <VcScrollTopButton v-if="infiniteScrollEnabled"></VcScrollTopButton>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ITableColumn,
  VcButton,
  VcCard,
  VcCheckbox,
  VcInfinityScrollLoader,
  VcScrollTopButton,
  VcTable,
} from "@/components";
import { AccountNavigation } from "@/shared/account";
import { PointsOperationForm, usePointsOperations, useUserBalance } from "@/shared/loyalty";
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import { clone } from "lodash";
import { PointsOperationsSearchParams } from "@/core/api/graphql/loyalty";
import { InputRegisterPointsOperationType } from "@/core/api/graphql/types";
import { currentUserId, storeId } from "@/core/constants";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const breakpoints = useBreakpoints(breakpointsTailwind);
const {
  loading: pointsOperationsLoading,
  loadingMore: morePointsOperationsLoading,
  pointsOperations,
  total,
  pages,
  fetchMyPointsOperations,
  fetchMorePointsOperations,
  addPointsOperation,
} = usePointsOperations({ userId: currentUserId, storeId });

const {
  loading: userBalanceLoading,
  myUserBalance,
  loadMyUserBalance,
} = useUserBalance({ userId: currentUserId, storeId });

const isMobile = breakpoints.smaller("md");
const editingMode: Ref<boolean> = ref(false);
const newOperation: Ref<InputRegisterPointsOperationType | null> = ref(null);
const infiniteScrollEnabled = ref(false);
const page = ref(1);
const itemsPerPage = ref(20);
const saveOperationLoading = ref(false);

const title: ComputedRef<string> = computed(() => {
  return editingMode.value
    ? t("pages.loyalty.points_operations.operations_list.new_operation_title")
    : t("pages.loyalty.points_operations.operations_list.operations_title");
});

const columns = ref<ITableColumn[]>([
  {
    id: "createdDate",
    title: t("pages.loyalty.points_operations.operations_list.created_date_label"),
    sortable: true,
  },
  {
    id: "reason",
    title: t("pages.loyalty.points_operations.operations_list.reason_label"),
    sortable: true,
  },
  {
    id: "amount",
    title: t("pages.loyalty.points_operations.operations_list.amount_label"),
    sortable: true,
  },
  {
    id: "balance",
    title: t("pages.loyalty.points_operations.operations_list.balance_label"),
    sortable: true,
  },
]);

async function onScrollModeChange() {
  page.value = 1;
  await loadOperations();
}

const onPageChange = async (newPage: number) => {
  page.value = newPage;
  await loadOperations();
};

// if address parameter is NULL, then adding a new address will open
function openEditMode() {
  const operation: InputRegisterPointsOperationType = {
    userId: currentUserId,
    storeId,
    reason: "",
    amount: 0,
  };

  newOperation.value = clone(operation);
  editingMode.value = true;
}

function closeEditMode() {
  newOperation.value = null;
  editingMode.value = false;
}

function formatDate(value: string): string {
  return value ? new Date(value).toLocaleString() : "";
}

async function saveOperation(operation: InputRegisterPointsOperationType): Promise<void> {
  const { reason, amount } = operation;

  saveOperationLoading.value = true;
  await addPointsOperation(reason, Number(amount));
  closeEditMode();
  saveOperationLoading.value = false;

  loadData();
}

onMounted(async () => {
  await loadData();
});

async function loadData() {
  await Promise.all([loadOperations(), loadMyUserBalance(false)]);
}

async function loadOperations() {
  const searchParams: PointsOperationsSearchParams = {
    userId: currentUserId,
    storeId,
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sort: "",
  };

  fetchMyPointsOperations(searchParams);
}

async function loadMoreOperations() {
  if (page.value == pages.value) {
    return;
  }

  const nextPage = page.value + 1;
  page.value = nextPage;

  const searchParams: PointsOperationsSearchParams = {
    userId: currentUserId,
    storeId,
    page: nextPage,
    itemsPerPage: itemsPerPage.value,
    sort: "",
  };

  await fetchMorePointsOperations(searchParams);
}
</script>

<style scoped>
.polygons-bg {
  background-image: url(/static/images/account/addresses-bg.svg);
  background-repeat: no-repeat;
  background-position: right;
}
.deposit {
  color: #ef4444;
}
.addition {
  color: #65a30d;
}
</style>
