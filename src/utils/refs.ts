import {ref} from "vue";

export function refs<T extends abstract new (...args: any) => any>(_component?: T){
  return ref<InstanceType<T> | null>(null);
}

export function refsE<T>(){
  return ref<T | null>(null);
}
