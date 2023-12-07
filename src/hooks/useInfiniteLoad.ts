import { nextTick, ref } from 'vue'

export function useInfiniteLoad(fetchListFn: () => Promise<any[]>) {
  const data = ref<any[]>()
  const list = ref<any[]>([])

  async function fetchData() {
    data.value = await fetchListFn()
    list.value.push(...data.value)
  }

  // observerFn
  async function init(containerEl: HTMLElement) {
    await fetchData()
    if (!containerEl) {
      return
    }

    await nextTick(() => {
      const dom = document.createElement('div')
      dom.setAttribute('id', 'loadmore')
      dom.style.height = '1px'
      dom.textContent = ' '
      containerEl.appendChild(dom)
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        const ratio = entries[0].intersectionRatio
        if (ratio === 1) {
          fetchData()
        }
      })
      observer.observe(dom)
    })
  }

  return { init, list }
}
