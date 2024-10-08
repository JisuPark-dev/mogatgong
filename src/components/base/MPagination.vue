<template>
  <BPagination
    v-model="model"
    :total-rows="totalRowCnt"
    :per-page="perPage"
    :hide-ellipsis="hideEllipsis"
    :limit="limit"
  />
</template>

<script setup lang="ts">
import { BPagination } from 'bootstrap-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    totalRowCnt?: number
    perPage?: number
    hideEllipsis?: boolean
    limit?: number
  }>(),
  {
    modelValue: 1,
    totalRowCnt: 100,
    perPage: 10,
    hideEllipsis: true,
    limit: 10
  }
)

const model = defineModel<number>()
</script>

<style scoped lang="scss">
.pagination {
  :deep(.page-item) {
    &.disabled {
      cursor: no-drop;

      &:first-child {
        .page-link {
          background: none;

          &::after {
            background: url('/imgs/ic_chevron_left_backward_gray.svg') no-repeat;
          }
        }
      }

      &:nth-child(2) {
        .page-link {
          background: none;

          &::after {
            background: url('/imgs/ic_chevron_left_pg_gray.svg') no-repeat;
          }
        }
      }

      &:nth-last-child(2) {
        .page-link {
          background: none;

          &::after {
            background: url('/imgs/ic_chevron_right_pg_gray.svg') no-repeat;
          }
        }
      }

      &:last-child {
        .page-link {
          background: none;

          &::after {
            background: url('/imgs/ic_chevron_forward_gray.svg') no-repeat;
          }
        }
      }
    }

    &.active {
      .page-link {
        color: $primary-500 !important;
        background-color: $primary-50 !important;
      }
    }

    &:first-child,
    &:nth-child(2),
    &:nth-last-child(2),
    &:nth-last-child(1) {
      .page-link {
        position: relative;
        color: transparent;
      }
    }

    &:first-child,
    &:nth-child(2),
    &:nth-last-child(2),
    &:nth-last-child(1) {
      .page-link {
        &::after {
          position: absolute;
          content: '';
          width: 12px;
          height: 12px;
          //left: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    &:first-child {
      .page-link {
        &::after {
          background: url('/imgs/ic_chevron_left_backward.svg') no-repeat;
        }
      }
    }

    &:nth-child(2) {
      .page-link {
        &::after {
          background: url('/imgs/ic_chevron_left_pg.svg') no-repeat;
        }
      }
    }

    &:nth-last-child(2) {
      .page-link {
        &::after {
          background: url('/imgs/ic_chevron_right_pg.svg') no-repeat;
        }
      }
    }

    &:nth-last-child(1) {
      .page-link {
        &::after {
          background: url('/imgs/ic_chevron_forward.svg') no-repeat;
        }
      }
    }

    .page-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 4px;
      @include button-3($color: $gray-700);
      -webkit-appearance: none; /* for chrome */
      -moz-appearance: none; /*for firefox*/
      appearance: none;
      overflow: hidden;
      position: relative;
      z-index: 1;

      &::before {
        content: '';
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      &:hover {
        &::before {
          display: block;
          background: $scrim-5;
        }
      }

      &:active {
        &::before {
          display: block;
          background: $scrim-10;
        }
      }

      &:focus {
        box-shadow: none;
        background-color: transparent;
      }
    }
  }
}
</style>