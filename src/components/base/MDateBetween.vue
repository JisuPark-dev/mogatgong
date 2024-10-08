<template>
  <div class='date-between' v-on-click-outside='close'>
    <div class='date-between__input-wrap' @click.stop='toggle'>
      <MIcon pathFill='#707378' icon='ic_calender_bold' :mr='0.5' :width='16' :height='16' />
      <span>{{ `방문경과${hasValue ? ':&nbsp;' : ''}` }}</span>
      <span v-if='hasValue'>
        {{ `${modelValue.date}`}}
      </span>
      <MIcon
        class='date-between__dropdown-arrow'
        icon='ic_chevron_down_bold'
        :class='{ active: showDropdown }'
        :ml='0.8'
        :width='10'
        :height='10'
        pathFill='$gray-600'
      />
    </div>
    <div class='date-between__dropdown-wrap'>
      <MDropDown
        :options="['']"
        :listBottomBorder='false'
        v-if='showDropdown'
        :enableButton='false'
      >
        <template #default>
          <div class='date-between__dropdown'>
            <div class='date-between__dropdown-filter-wrap'>
              <span class='date-between__date-filter'>
              방문한 지
              <MInput type='number' :minNumber='Number(durationAfterVisit)' v-model='durationAfterVisit' />
              일 이상 경과
                </span>
<!--              <MCheckBox v-model='isChecked'>신규환자 포함</MCheckBox>-->
            </div>
<!--            <MButton scale='xxs' variant='text-blue' @click='ok'>적용</MButton>-->
          </div>
        </template>
      </MDropDown>
    </div>
  </div>
</template>

<script setup lang='ts'>
import MIcon from '@/components/base/MIcon.vue'
import { computed, ref, watch } from 'vue'
import MDropDown from '@/components/base/MDropDown.vue'
import { vOnClickOutside } from '@vueuse/components'
import MInput from '@/components/base/MInput.vue'

const modelValue = defineModel<{ date: number|undefined, isChecked: boolean }>({
    default: () => ({ date: 0, isChecked: true })
  }
)

const durationAfterVisit = ref<string | undefined>('')
const showDropdown = ref(false)
const isChecked = ref(true)

const emit = defineEmits<{
  'refetchPatientList': [];
}>()

watch(
  modelValue,
  () => {
    durationAfterVisit.value = `${modelValue.value.date}`
    emit('refetchPatientList')
  },
  { immediate: true }
)

watch(durationAfterVisit,
    ()=>{
      if (durationAfterVisit.value === 'undefined') {
        durationAfterVisit.value = ''
      }

      modelValue.value = {
        date: Number(durationAfterVisit.value),
        isChecked: isChecked.value
    }
})

const toggle = () => {
  showDropdown.value = !showDropdown.value
}

// const ok = () => {
//   if (durationAfterVisit.value === 'undefined') {
//     durationAfterVisit.value = ''
//   }
//
//   modelValue.value = {
//     date: Number(durationAfterVisit.value),
//     isChecked: isChecked.value
//   }
//   close()
// }

const hasValue = computed(() => {
  return !!modelValue.value?.date || modelValue.value?.date === 0
})

const close = () => {
  showDropdown.value = false
}
</script>

<style scoped lang='scss'>
.date-between {
  display: flex;
  flex-direction: column;
  @include button-3;
  white-space: nowrap;

  &__dropdown-wrap {
    position: relative;
  }

  &__dropdown {
    gap: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    :deep(.input-default) {
      min-width: 6rem;
    }

    :deep(.btn) {
      width: 12rem;
    }
  }

  &__dropdown-filter-wrap {
    gap: 2.4rem;
    display: flex;
  }

  &__date-filter {
    gap: .4rem;
    display: flex;
    align-items: center;
  }

  &__input-wrap {
    border-radius: 6px;
    border: 1px solid #d6d9dd;
    padding: 0.7rem;
    display: flex;
    align-items: center;
    cursor: pointer;

    :deep(.b-form-tags) {
      all: inherit;
    }
  }

  :deep(.list-group) {
    width: fit-content;
    min-width: 18rem;
  }

  &__checkbox-include-new-ones {
    gap: .4rem;
    display: flex;
    @include body-4;
  }
}
</style>