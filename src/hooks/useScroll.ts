import { nextTick, ref } from 'vue'

export function useScroll() {
  const scrollRef = ref<any>(null)

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value) {
      scrollRef.value.scrollTop = 0
    }
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
  }
}
