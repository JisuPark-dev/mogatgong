<template>
  <label class='mphone-number'>
    <span v-if='props.label' class='phone-number__label' :class="{ '--required': props.isRequired }">{{
        props.label
      }}</span>
    <span class='phone-number__inner-wrap'>
      <MInput
        v-model='model'
        class='phone-number__frontNum'
        :maxLength='13'
        :limitCnt='13'
        pattern='[0-9]*'
        inputMode='numeric'
        enterkeyhint='next'
        tabindex='1'
        :placeholder='placeholder'
      />
      <label class="custom-radio">
        <!-- 라디오 버튼을 감추기 -->
        <input
            type="radio"
            :value="priorityValue"
            :checked="priorityContact === priorityValue"
            @change="updatePriorityContact(priorityValue)"
            class="hidden-radio"
        />
        <!-- 커스텀 이미지 아이콘 -->
        <MIcon
            v-if="priorityContact === priorityValue"
            icon="ic_star_fill"
            :width="18"
            :height="18"
            :pathFill="'rgba(255, 215, 0, 1)'"
            class="radio-icon"
        />
        <MIcon
            v-if="priorityContact != priorityValue"
            icon="ic_star_bold"
            :width="18"
            :height="18"
            :pathFill="'rgba(80, 83, 89, 1)'"
            class="radio-icon"
        />
      </label>
    </span>
  </label>
</template>

<script setup lang='ts'>
import MInput from '@/components/base/MInput.vue'
import { formatPhoneNumber } from '@/utils/string'
import {computed} from "vue";
import MIcon from "@/components/base/MIcon.vue";

const props = withDefaults(
  defineProps<{
    label?: string
    isRequired?: boolean
    priorityContact?: any
    priorityValue: string
    placeholder: string
  }>(),
  {}
)
const emit = defineEmits(['update:priorityContact'])
const priorityContact = computed({
  get: () => props.priorityContact,
  set: (value) => emit('update:priorityContact', value)
})
const updatePriorityContact = (value: string) => {
  priorityContact.value = value
}

const model = defineModel<string>({
  get(v) {
    return formatPhoneNumber(v).trim()
  },
  set(v) {
    return v.replace('-', '').trim()
  }
})
</script>

<style scoped lang='scss'>
.phone-number {
  display: flex;
  flex-direction: column;
  flex: 1;

  &__label {
    flex: 1;
    @include button-3($color: rgba(80, 83, 89, 1));
    margin-bottom: 0.8rem;

    &.--required {

      &::after {
        margin-left: 0.2rem;
        content: '*';
        color: rgba(240, 47, 48, 1);
      }
    }
  }

  &__inner-wrap {
    display: flex;
    align-items: center;
    gap: 8px
  }

  :deep(.input-default) {
    input {
      @include body-3;
      padding: .4rem;

      &::placeholder {
        letter-spacing: normal;
      }
    }
  }

  &__dash {
    padding: 0 .8rem;
  }
}

.custom-radio{
  align-items: center;
  .hidden-radio {
    display: none; /* 기본 라디오 버튼 숨기기 */
  }

  .radio-icon {
    cursor: pointer;
  }
}
</style>