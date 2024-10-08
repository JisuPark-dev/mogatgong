<template>
  <div class='dropdown-multi-select' v-on-click-outside='close'>
    <div class='dropdown-multi-select__input-wrap' @click.stop='toggle'>
      <MIcon
        pathFill='#707378'
        :icon='props.icon'
        :mr='0.5'
        :width='props.iconWidth'
        :height='props.iconHeight'
      />
      <span>{{ `${props.label}${modelValue.length ? ':&nbsp;' : ''}` }}</span>
      <div>
        <BFormTags noOuterFocus v-model='modelValue'>
          <template v-slot='{ tags }'>
            <ul class='dropdown-multi-select__tag-list'>
              <li v-for='(tag, idx) in tags' :key='tag' class='dropdown-multi-select__tag-item'
                  v-if='tags.length < props.displayItemLimit'>
                <span v-if='!findColor(tag) && findBackGroundColor(tag)'
                :style="{ background: findBackGroundColor(tags[idx]), borderRadius: '4px', padding:'4px'}">
                  {{ tag }}
                </span>
                <span v-if='!findColor(tag) && !findBackGroundColor(tag)'>
                  {{ tag }}
                </span>
                <div
                  v-else
                  class='dropdown-multi-select__circle'
                  :style='{ background: findColor(tag) }'
                />
                <span>
                  {{ tags.length > 1 && modelValue[tags.length - 1] != tag ? ',' : '' }}
                </span>
              </li>
              <li class='dropdown-multi-select__tag-item' v-else>
                <div
                  v-if='!!findColor(tags[0])'
                  class='dropdown-multi-select__circle'
                  :style='{ background: findColor(tags[0]) }'
                />
                {{ `${tags[0]} 외 ${tags.length}곳` }}
              </li>
            </ul>
          </template>
        </BFormTags>
      </div>
      <MIcon
        class='dropdown-multi-select__dropdown-arrow'
        icon='ic_chevron_down_bold'
        :class='{ active: showDropdown }'
        :ml='0.8'
        :width='10'
        :height='10'
        pathFill='$gray-600'
      />
    </div>
    <div class='dropdown-multi-select__dropdown-wrap'>
      <MDropDown
        :options='tags()'
        @click='onClickDropDown'
        :listBottomBorder='false'
        v-if='showDropdown'
        :background="background"
      >
        <template #beforeItems v-if='props.enableSelectAll'>
          <div class='dropdown-multi-select__select-all-wrap'>
            <span @click='selectAll'>{{tags().length}}개 전체 선택</span>
            <span @click='deselectAll'>전체 해제</span>
          </div>
        </template>
        <template #before='value'>
          <input type='checkbox' :checked='modelValue.includes(value.item)' />
        </template>
        <template #after='{ item }'>
          <div
            class='dropdown-multi-select__circle'
            v-if='!!findColor(item)'
            :style='{ background: findColor(item) }'
          />
        </template>
      </MDropDown>
    </div>
  </div>
</template>

<script setup lang='ts'>
import MIcon from '@/components/base/MIcon.vue'
import { BFormTags } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import MDropDown from '@/components/base/MDropDown.vue'
import { vOnClickOutside } from '@vueuse/components'

const props = withDefaults(
  defineProps<{
    // 아이템 셋팅 값
    dropdownItems?: { tag: string; color?: string; backgroundColor?: string }[]
    label: string
    displayItemLimit?: number
    icon: string
    iconWidth?: number
    iconHeight?: number
    modelValue?: string[]
    enableSelectAll?: boolean
    background?:string[]
    infoIcon?: boolean
  }>(),
  {
    label: '',
    iconWidth: 17,
    iconHeight: 17,
    modelValue: () => [],
    dropdownItems: () => [],
    displayItemLimit: 10
  }
)

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'refetchPatientList': [];
}>()

const showDropdown = ref(false)

const toggle = () => {
  showDropdown.value = !showDropdown.value
}

const close = () => {
  showDropdown.value = false
}

const onClickDropDown = (tag: string) => {
  if (modelValue.value.includes(tag)) {
    modelValue.value = modelValue.value.filter((item) => item !== tag)
    emit('refetchPatientList')
    return
  }
  modelValue.value = [...modelValue.value, tag]
  emit('refetchPatientList')
}

const selectAll = () => {
  modelValue.value = tags()
  emit('refetchPatientList')
}

const deselectAll = () => {
  modelValue.value = []
  emit('refetchPatientList')
}

const tags = () => {
  return props.dropdownItems?.map((item) => item.tag)
}

const findColor = (tag: string) => {
  return props.dropdownItems?.find((item) => item.tag === tag)?.color
}

const findBackGroundColor = (tag: string) => {
  return props.dropdownItems?.find((item) => item.tag === tag)?.backgroundColor
}
</script>

<style scoped lang='scss'>
.dropdown-multi-select {
  display: flex;
  flex-direction: column;
  @include button-3;
  white-space: nowrap;

  &__select-all-wrap {
    gap: .8rem;
    padding: .9rem .8rem .3rem .8rem;
    font-size: 1.2rem;
    color: rgba(152, 155, 160, 1);
    text-decoration: underline;
    display: flex;
    cursor: pointer;
    font-weight: 500;
    line-height: 1.6rem;
  }

  &__dropdown-wrap {
    position: relative;
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

  &__tag-list {
    gap: 0.8rem;
    display: flex;
    @include button-3;
  }

  &__tag-item {
    gap: 0.2rem;
    display: flex;

    .dropdown-multi-select__circle {
      margin-left: 0.2rem;
    }
  }

  &__circle {
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
  }

  :deep(.list-group) {
    width: fit-content;
    min-width: 18rem;
  }
}
</style>