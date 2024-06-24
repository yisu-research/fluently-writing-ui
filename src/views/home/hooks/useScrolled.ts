import { ref, watchEffect } from 'vue';

export function useScrolled() {
  const scrolled = ref(false);

  function handleScroll() {
    if (window.scrollY > 0) {
      scrolled.value = true
    } else {
      scrolled.value = false
    }
  }

  watchEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return { scrolled }
}