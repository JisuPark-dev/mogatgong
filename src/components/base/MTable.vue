<template>
  <BTable
    ref="selectableTable"
    :table-class="[
      { 'react-border': listFullCheck },
      { 'list-none': getItems.length === 0 && hasSlots('tableNone') },
      'text-nowrap'
    ]"
    responsive
    hover
    :striped="striped"
    :show-empty="itemNoneSlot"
    :sticky-header="stickyHeader"
    :selectable="selectable"
    :select-mode="selectMode"
    @head-clicked="onHeadClicked"
    @row-selected="onRowSelected"
    @row-clicked="onRowClicked"
    @rowDblClicked="onRowDbClicked"
    :fields="getFields"
    :items="getItems"
  >
    <template #cell(index)="data: any">
      {{ (pageNum - 1) * 10 + data.index + 1 }}
    </template>
    <template v-for="slot in Object.keys($slots)" v-slot:[toCellName(slot)]="props: any">
      <slot v-bind="props" :name="slot" />
    </template>

    <!-- table - content X 경우 -->
    <template #empty>
      <slot name="tableNone" />
    </template>
  </BTable>
</template>

<script setup lang="ts">
import { BTable } from 'bootstrap-vue-next'
import { refs } from '@/utils/refs'
import { computed, ref, useSlots, watch } from 'vue'
import { type SortOrder, type TableSortValue } from '@commons/types/components'

const props = withDefaults(
  defineProps<{
    itemNoneSlot?: boolean
    striped?: 'true' | 'false' | '' | boolean
    tbodyTrClass?: (item?: any) => any | null
    fields?: any[]
    items?: any[]
    stickyHeader?: 'true' | 'false' | '' | boolean
    selectable?: 'true' | 'false' | '' | boolean
    selectMode?: 'multi' | 'single' | 'range'
    pageNum?: number
    fullListCheckNum?: number
    sortOrder?: SortOrder
  }>(),
  {
    tbodyTrClass: () => '',
    itemNoneSlot: false,
    striped: true,
    fields: () => [],
    items: () => [],
    stickyHeader: false,
    selectable: true,
    selectMode: 'single',
    pageNum: 0,
    fullListCheckNum: 0,
    sortOrder: () => ({
      orderBy: 'requestDtm',
      orderDir: 'desc'
    })
  }
)

const slots = useSlots()
const hasSlots = (slotName: string) => {
  return !!slots[slotName]
}

const listFullCheck = computed(() => {
  if (props.items.length > 0 && props.fullListCheckNum > 0) {
    return props.items.length === props.fullListCheckNum
  } else {
    return true
  }
})

const getFields = ref<any>([])
watch(
  [() => props.fields, () => props.sortOrder],
  () => {
    getFields.value = props.fields.map(({ ...item }) => {
      if (item.sortArrow) {
        item.class = 'choice'
        if (item.key === props.sortOrder.orderBy) {
          item.class += `${props.sortOrder.orderDir === 'desc' ? ` down` : ' up'}`
        }
      }
      return item
    })
  },
  { immediate: true, deep: true }
)

const getItems = computed<any[]>(() => {
  return props.items.map((item) => ({ ...item, _rowVariant: props.tbodyTrClass(item) }))
})

const emit = defineEmits<{
  rowSelected: [value: any]
  rowClicked: [value: any]
  rowDbClicked: [value: any]
  headClicked: [value: any]
  fieldSort: [value: TableSortValue]
}>()

function onRowSelected(v: any) {
  emit('rowSelected', v)
}

function onRowClicked(v: any) {
  emit('rowClicked', v)
}

function onRowDbClicked(v: any) {
  emit('rowDbClicked', v)
}

function onHeadClicked(v: any) {
  changeFieldSort(v)
  emit('headClicked', v)
}

function changeFieldSort(key: string) {
  const findIdx = props.fields.findIndex((item) => item.key === key)
  const sortOrder = { ...props.sortOrder };
  if (props.fields[findIdx].sortArrow) {
    if (key === props.sortOrder.orderBy) {
      sortOrder.orderDir = props.sortOrder.orderDir === 'desc' ? 'asc' : 'desc';
    } else {
      sortOrder.orderBy = key;
      sortOrder.orderDir = 'desc';
    }
    emit('fieldSort', sortOrder);
  }
}

const selectableTable = refs(BTable)

function selectAllRows() {
  selectableTable.value?.selectAllRows()
}

function clearSelected() {
  selectableTable.value?.clearSelected()
}

function toCellName(slot: any) {
  return `cell(${slot})`
}

defineExpose({
  selectAllRows,
  clearSelected
})
</script>

<style scoped lang="scss"></style>

<style lang="scss">
/**
* Table 공용 효과 모듈
*/
// inline border - bottom
@mixin tableInlineBorderBottom {
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: .1rem;
    background: $gray-200;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
  }
}

// hover - bg
@mixin hoverBg {
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: $scrim-5;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}

// sort effect
@mixin arrow($upSrc: '/imgs/ic_triangle_up.svg', $downSrc: '/imgs/ic_triangle_down.svg') {
  &::after {
    content: '';
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    margin-left: .2rem;
    background:
      url($upSrc),
      url($downSrc) center center no-repeat;
  }
}

// table - bootstrap 효과 제거
.sr-only {
  display: none;
}

.b-table-sticky-header {
  max-height: 23rem;
}

// table - bootstrap 효과 제거 및 디자인 가이드 반영
.table-responsive {
  margin-bottom: 0 !important;
  box-sizing: content-box;
  border: 1px solid $gray-200;
  border-radius: 8px;
  position: relative;

  &.b-table-sticky-header {
    max-height: unset;
  }
}

.table {
  // border last 동적처리
  &.react-border {
    tbody {
      tr {
        &:last-of-type {
          td {
            border-bottom: 0;

            &::after {
              display: none;
            }
          }
        }
      }
    }
  }

  // list-none 처리
  &.list-none {
    thead {
      display: none;
    }
  }

  thead {
    position: relative;

    tr {
      th {
        padding: .8rem;
        width: 13.6rem;
        border-bottom: none;
        box-sizing: content-box;
        position: relative;
        background-color: $gray-50 !important;
        line-height: 1.3rem;
        @include button-4();
        @include tableInlineBorderBottom;

        &:first-child {
          padding-left: 1.6rem;
        }

        &.choice {
          cursor: pointer;

          &:hover,
          &:active {
            @include hoverBg;
          }

          &.up {
            color: $primary-500;

            > div {
              @include arrow($upSrc: '/imgs/ic_triangle_up_fill.svg');
            }
          }

          &.down {
            color: $primary-500;

            > div {
              @include arrow($downSrc: '/imgs/ic_triangle_down_fill.svg');
            }
          }

          > div {
            gap: unset;
            @include arrow();
          }
        }
      }
    }
  }

  tbody {
    tr {
      td {
        position: relative;
        padding: .8rem;
        box-sizing: content-box;
        border-bottom: 0;
        @include body-4($color: $gray-800);
        @include tableInlineBorderBottom;

        &:first-child {
          padding-left: 1.6rem;
        }
      }

      // table item none content
      &.b-table-empty-slot {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: -1;

        &:hover {
          > td {
            box-shadow: unset;
          }
        }

        td {
          padding: 0 !important;

          &::before {
            display: none !important;
          }
        }
      }
    }
  }

  th,
  td {
    vertical-align: middle !important;
    background-color: transparent !important;

    p {
      margin-bottom: 0;
    }
  }
}
</style>