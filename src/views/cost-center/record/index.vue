<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NModal, NPopconfirm, NQrCode, NScrollbar, NSpin, NTag, useMessage } from 'naive-ui'
import api from '@/api'
import { formatDateTime } from '@/utils/format'
import { SvgIcon } from '@/components/common'

const state = reactive<any>({
  orders: [],
  showModal: false,
  orderLoading: false,
  qrCode: '无效的二维码',
  orderDetail: {
    id: 105,
    product_id: 1,
    user_id: 3,
    out_trade_no: '202303191015131234567995',
    transaction_id: '4200001780202303190797858892',
    amount: 100,
    expired_at: '2023-03-19T18:25:13.004+08:00',
    state: 'paid',
    product_name: '1块钱1积分',
    product_description: '1',
    product_price: 100,
    product_call_count: 10,
    code_url: 'weixin://wxpay/bizpayurl?pr=oOLyCNRzz',
    paid_at: '2023-03-19T18:15:26.000+08:00',
    canceled_at: null,
    created_at: '2023-03-19T18:15:13.004+08:00',
    updated_at: '2023-03-19T18:15:27.088+08:00',
  },
  page: {
    active: 1,
    total: 0,
    limit: 20,
    isStart: false,
    isEnd: false,
  },
  currentStyle:
    'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
  defaultStyle: 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
})

let pollingST: any = null

const destroyed = () => {
  clearTimeout(pollingST)
  pollingST = null
}

const message = useMessage()

const polling = (id: any) => {
  api.getOrderDetailApi(id).then(async (res: any) => {
    if (res.state !== 'pending') {
      state.showModal = false
      destroyed()
      message.success('支付成功')
      try {
        const res: any = await api.getOrderListApi({ page: state.page.active, limit: state.page.limit })
        for (const order of res.orders) {
          const obj = {
            product: {
              name: order.product_name,
              price: order.product_price,
              tokens: order.product_tokens,
            },
            date: order.created_at,
            id: order.id,
            state: order.state,
            no: order.out_trade_no,
          }
          state.orders.push(obj)
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      pollingST = setTimeout(() => {
        clearTimeout(pollingST)
        polling(id)
      }, 2000)
    }
  })
}

const qrcode = ref(state.qrCode)

const handleOrderDetail = async (id: any) => {
  state.showModal = true
  state.orderLoading = true
  try {
    const res: any = await api.getOrderDetailApi(id)
    state.orderLoading = false
    state.orderDetail = res
    state.qrCode = res.code_url
    qrcode.value = res.code_url
    if (res.state === 'pending') {
      polling(res.id)
    }
  } catch (error) {
    console.error(error)
  }
}

// 关闭后更新页面数据
const handleAfterLeave = async () => {
  destroyed()
}

const handlePayCancel = async () => {
  try {
    await api.cancelOrderApi(state.orderDetail.id)
    state.showModal = false
    handleAfterLeave()
    message.success('订单取消成功')
  } catch (error) {
    console.error(error)
    message.success('取消订单失败，请稍后重试')
  }
}

const handleClose = () => {
  state.showModal = false
  handleAfterLeave()
}

const pages = ref<any>([])

const route = useRoute()

const nextPage = () => {
  if (state.page.active < state.page.total) {
    return Number(state.page.active) + 1
  }
  return state.page.active
}

const prevPage = () => {
  if (state.page.active > 1) {
    return Number(state.page.active) - 1
  }
  return state.page.active
}

const stateMap: any = {
  pending: '待支付',
  paid: '已支付',
  canceled: '已取消',
  closed: '已关闭',
}

const bodyStyle = {
  width: '600px',
}

const orderData = computed(() => [
  {
    title: '套餐',
    value: `${state.orderDetail.product_name}`,
  },
  {
    title: '金额',
    value: `${state.orderDetail.product_price / 100} 元`,
  },
  {
    title: '订单状态',
    value: stateMap[state.orderDetail.state],
  },
  {
    title: '订单号',
    value: state.orderDetail.out_trade_no,
  },

  {
    title: '下单时间',
    value: formatDateTime(state.orderDetail.created_at),
  },
  {
    title: '订单过期时间',
    value: `${formatDateTime(state.orderDetail.expired_at)}`,
  },
])

onMounted(async () => {
  state.page.active = route.query.page
  // 获取订单列表
  const res: any = await api.getOrderListApi({ page: state.page.active, limit: state.page.limit })

  state.page.total = Math.ceil(res.total_count / state.page.limit)

  for (let i = 1; i <= state.page.total; i++) {
    pages.value.push(i)
  }

  if (state.page.active === 1) {
    state.page.isStart = true
  }

  if (state.page.active === state.page.total) {
    state.page.isEnd = true
  }

  for (const order of res.orders) {
    const obj = {
      product: {
        name: order.product_name,
        price: order.product_price,
        tokens: order.product_tokens,
      },
      date: order.created_at,
      id: order.id,
      state: order.state,
      no: order.out_trade_no,
    }
    state.orders.push(obj)
  }
})
</script>

<template>
  <div class="mt-16 transition-all h-2xl">
    <div
      class="flex flex-col h-full overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow-sm ring-1 ring-slate-100"
    >
      <div class="px-4 py-5 sm:px-6">
        <p class="text-lg font-bold">消费记录</p>
      </div>
      <NScrollbar class="flex-1 max-h-auto">
        <div class="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="order in state.orders" :key="order.id">
              <div class="block hover:bg-gray-50" @click="handleOrderDetail(order.id)">
                <div class="flex items-center px-4 py-4 sm:px-6">
                  <div class="flex items-center flex-1 min-w-0">
                    <div class="flex-1 min-w-0 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p class="text-sm font-medium text-teal-500 truncate">
                          {{ order.product.name }}
                        </p>
                        <p class="flex items-center mt-2 text-sm text-gray-500">
                          <span class="truncate">{{ order.no }}</span>
                        </p>
                      </div>
                      <div class="hidden md:block">
                        <div>
                          <p class="text-sm text-gray-900">
                            <time :datetime="order.date">{{ formatDateTime(order.date) }}</time>
                          </p>
                          <div class="flex mt-2 text-sm text-gray-500">
                            <SvgIcon icon="uil:desert" class="text-lg text-teal-500" />
                            <div class="ml-2 text-teal-500">
                              {{ stateMap[order.state] }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <NModal
          v-model:show="state.showModal"
          class="custom-card"
          preset="card"
          :show-icon="false"
          aria-modal="true"
          :style="bodyStyle"
          size="huge"
          title="订单详情"
          :closable="false"
          :bordered="false"
          :mask-closable="false"
        >
          <!-- <template #header-extra> 订单支付 </template> -->
          <NSpin :show="state.orderLoading" stroke="10BA9B">
            <div v-if="state.orderLoading" class="h-40"></div>
            <div v-else class="mt-4">
              <div class="flex flex-col justify-between md:flex-row lg:flex-row">
                <div class="flex md:base-2/3">
                  <div class="flex flex-col items-start justify-start">
                    <div v-for="item in orderData" :key="item.title" class="mt-2">
                      <div class="flex flex-col justify-start sm:flex-row">
                        <p class="text-md">{{ `${item.title}：` }}</p>
                        <p class="text-teal-500">{{ ` ${item.value}` }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="state.orderDetail.state === 'pending'"
                  class="flex flex-col items-center justify-center md:base-2/3"
                >
                  <div class="">
                    <NQrCode :value="qrcode" class="w-40 h-40" />
                  </div>
                  <div class="flex">
                    <p>使用微信扫一扫支付</p>
                  </div>
                </div>
              </div>
              <div class="flex items-end justify-end mt-8">
                <NPopconfirm
                  v-if="state.orderDetail.state === 'pending'"
                  placement="bottom"
                  @positive-click="handlePayCancel()"
                >
                  <template #trigger>
                    <NButton strong secondary round type="warning" class="mr-8"> 取消订单 </NButton>
                  </template>
                  确定取消订单?
                </NPopconfirm>
                <NButton strong secondary round type="success" class="mr-4" @click="handleClose"> 关闭 </NButton>
              </div>
            </div>

            <template #description>
              <NTag :bordered="false" type="success">
                <p class="text-lg font-medium">正在获取 ...</p>
              </NTag>
            </template>
          </NSpin>
        </NModal>
      </NScrollbar>
      <div class="px-4 py-5 sm:px-6">
        <div class="flex items-center justify-between bg-white sm:px-6">
          <div class="flex justify-between flex-1 sm:hidden">
            <router-link :to="{ path: '/cost', query: { page: prevPage() } }">
              <div
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span class="sr-only">上一页</span>
                <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
              </div>
            </router-link>

            <router-link :to="{ path: '/cost', query: { page: nextPage() } }">
              <div
                class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span class="sr-only">下一页</span>
                <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
              </div>
            </router-link>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
            <div>
              <nav class="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                <router-link :to="{ path: '/cost', query: { page: prevPage() } }">
                  <div
                    class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span class="sr-only">上一页</span>
                    <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
                  </div>
                </router-link>
                <router-link
                  v-for="page in state.page.total"
                  :key="page"
                  :to="{ path: '/cost', query: { page } }"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                  :class="state.page.active === page ? state.currentStyle : state.defaultStyle"
                >
                  {{ page }}
                </router-link>

                <router-link :to="{ path: '/cost', query: { page: nextPage() } }">
                  <div
                    class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
                  </div>
                </router-link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
