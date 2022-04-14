<template>
  <form class="overflow-x-hidden" @submit.prevent="save">
    <slot name="prepend" v-bind="slotsData" />

    <div class="md:flex">
      <div class="md:w-1/2">
        <VcInput
          v-model="amount"
          :type="'number'"
          :error-message="errors.amount"
          :is-disabled="disabled"
          :label="$t('shared.loyalty.points_operation_form.amount_label')"
          class="mb-4"
          is-required
        />

        <VcInput
          v-model="reason"
          :error-message="errors.reason"
          :is-disabled="disabled"
          :label="$t('shared.loyalty.points_operation_form.reason_label')"
          class="mb-4"
          is-required
        />
      </div>
    </div>

    <slot name="append" v-bind="slotsData" />
  </form>
</template>

<script setup lang="ts">
import { computed, PropType, ref, Ref, watch } from "vue";
import { clone } from "lodash";
import { useForm, useField } from "vee-validate";
import { VcInput } from "@/components";
import { InputRegisterPointsOperationType } from "@core/api/graphql/types";
import { Logger } from "@core/utilities";
import * as yup from "yup";

const props = defineProps({
  disabled: Boolean,

  modelValue: {
    type: Object as PropType<InputRegisterPointsOperationType | null>,
    default: null,
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", operation: InputRegisterPointsOperationType): void;
  (event: "save", operation: InputRegisterPointsOperationType): void;
}>();

const _emptyOperation: Readonly<InputRegisterPointsOperationType> = {
  userId: "",
  storeId: "",
  amount: 0,
  reason: "",
  // FIXME: The values may be NULL. Incorrect behavior of the "dirty" variable
};

const initialValues: Ref<InputRegisterPointsOperationType> = ref(clone(props.modelValue || _emptyOperation));

const {
  values,
  meta,
  errors,
  handleSubmit,
  setValues,
  setErrors,
  validate,
  resetForm: reset,
} = useForm({ initialValues });

const slotsData = computed(() => ({
  setErrors,
  validate,
  reset,
  clear,
  save,
  errors,
  values,
  dirty: meta.value.dirty,
  valid: meta.value.valid,
  validated: meta.value.validated,
  pending: meta.value.pending,
  touched: meta.value.touched,
}));

const amountRules = computed(() => yup.number().required().min(-10000).max(10000).notOneOf([0]));

const reasonRules = computed(() => yup.string().max(256).required());

const { value: amount } = useField<number>("amount", amountRules);
const { value: reason } = useField<string>("reason", reasonRules);

const save = handleSubmit((operation) => {
  emit("save", operation);
}, Logger.debug);

function clear() {
  setValues({
    ...props.modelValue,
    ..._emptyOperation,
  });
}

watch(
  () => props.modelValue,
  (value: InputRegisterPointsOperationType | null) => {
    initialValues.value = clone(value || _emptyOperation);
    setValues(initialValues.value);
  },
  { deep: true }
);
</script>
