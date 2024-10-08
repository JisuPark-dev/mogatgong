import {onUnmounted, ref} from "vue";

interface UseTimerOptions {
  initialSec: number;
}

export function useTimer(callback?: Function, options: UseTimerOptions = {initialSec: 5}) {
  const {initialSec} = options;
  const counter = ref(initialSec);
  const isActive = ref(false);
  let timer: ReturnType<typeof setTimeout> | null;

  const reset = () => {
    pause();
    counter.value = initialSec;
  };

  function clean() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function pause() {
    isActive.value = false;
    clean();
  }

  function tempPause() {
    clean();
  }

  function resume() {
    const intervalValue = initialSec;
    if (!intervalValue || intervalValue <= 0) return;
    isActive.value = true;
    clean();
    timer = setTimeout(() => {
      counter.value -= 1;
      callback && callback();
      if (counter.value) {
        resume();
      } else {
        pause();
      }
    }, 1000);
  }

  onUnmounted(() => {
    clean();
  });

  return {
    reset,
    pause,
    resume,
    tempPause,
    counter,
    isActive,
  };
}
