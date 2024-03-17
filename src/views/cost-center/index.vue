<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { NButton, NDataTable, NLayout, NModal, NPopconfirm, NPopover, NQrCode, NSpin, NTag, useMessage } from 'naive-ui'
import Record from './record/index.vue'
import api from '@/api'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useUserStoreWithOut } from '@/store'
import { formatDateTime } from '@/utils/format'

import QrCodeImg from '@/assets/images/qrcode.jpg'

const message = useMessage()

const userStore = useUserStoreWithOut()

const state = reactive<any>({
  products: [],
  showModal: false,
  orderLoading: false,
  qrCode: '无效的二维码',
  orderDetail: {
    id: null,
    product_id: 1,
    user_id: 2,
    out_trade_no: '202303190324221234567895',
    expired_at: '2023-03-19T11:34:22.857+08:00',
    amount: 100,
    state: '',
    product_name: '1块钱10积分',
    product_price: 100,
    product_call_count: 10,
    product_description: '1',
    code_url: '无效的二维码',
    paid_at: null,
    canceled_at: null,
    transaction_id: null,
    created_at: '2023-03-19T11:24:22.858+08:00',
    updated_at: '2023-03-19T11:24:23.287+08:00',
  },
})

let pollingST: any = null

const destroyed = () => {
  clearTimeout(pollingST)
  pollingST = null
}

const polling: any = (id: any) => {
  api.getOrderDetailApi(id).then(async (res: any) => {
    if (res.state !== 'pending') {
      state.showModal = false
      destroyed()
      message.success('支付成功')
      try {
        await userStore.fetchProfile()
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

const qrcode = ref(state.qrCode)

const { isMobile } = useBasicLayout()

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

const handleOrder = async (id: any) => {
  state.showModal = true
  state.orderLoading = true
  try {
    const res: any = await api.postOrderApi({ product_id: id })
    state.orderLoading = false
    state.orderDetail = res
    state.qrCode = res.code_url
    qrcode.value = res.code_url
    polling(res.id)
  } catch (error) {
    console.error(error)
  }
}

const bodyStyle = {
  width: '600px',
}

const handleClose = () => {
  state.showModal = false
  handleAfterLeave()
}

// 计费表格
const createColumns = () => {
  return [
    {
      title: '积分',
      key: 'credit',
      rowSpan: (rowData: any, rowIndex: any) => (rowIndex === 0 ? 7 : 1),
    },
    {
      title: '模型',
      key: 'type',
      rowSpan: (rowData: any, rowIndex: any) => {
        if (rowIndex === 0 || rowIndex === 2) {
          return 2
        }
        if (rowIndex === 4) {
          return 3
        }
        return 1
      },
    },
    {
      title: '积分消耗',
      key: 'description',
      colSpan: (rowData: any, rowIndex: any) => (rowIndex === 2 ? 2 : 1),
    },
  ]
}

const createData = () => [
  {
    key: 0,
    credit: '1 积分',
    type: 'ChatGPT',
    description: '输入: 20000 tokens',
  },
  {
    key: 1,
    credit: '1 积分',
    type: 'ChatGPT',
    description: '输出: 6667 tokens',
  },
  {
    key: 2,
    credit: '1 积分',
    type: 'GPT4',
    description: '输入: 1000 tokens',
  },
  {
    key: 3,
    credit: '1 积分',
    type: 'GPT4',
    description: '输出: 333 tokens',
  },
  {
    key: 4,
    credit: '1 积分',
    type: 'GPT4-Vision',
    description: '输入: 1000 tokens',
  },

  {
    key: 5,
    credit: '1 积分',
    type: 'GPT4-Vision',
    description: '输出: 333 tokens',
  },
  {
    key: 6,
    credit: '1 积分',
    type: 'GPT4-Vision',
    description: '图片: 4张',
  },
]

const data = ref(createData())

const columns = ref(createColumns())

onMounted(async () => {
  try {
    const products: any = await api.getProductListApi()

    state.products = products
      .map((item: any) => {
        const price = item.price / 100
        const isDiscount = item.description !== '10'
        const mostPopular = price === 100

        return {
          id: item.id,
          name: item.name,
          price,
          description: item.description,
          credit: item.credit,
          callCount: item.call_count,
          originalPrice: price / Number(item.description / 10),
          isDiscount,
          mostPopular,
        }
      })
      .sort((a: any, b: any) => a.price - b.price)
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <NLayout
      class="h-full"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <!-- 剩余字符数 -->
      <div class="py-20 bg-teal-500/[0.9] sm:py-16">
        <div class="max-w-4xl px-6 mx-auto lg:px-8">
          <dl class="grid grid-cols-1 text-center gap-y-16 gap-x-8">
            <div class="flex flex-col max-w-xs mx-auto gap-y-4">
              <dt class="text-base leading-7 text-gray-100">剩余积分</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {{ userStore.getCredit }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- 购买字符 -->
      <div class="sm:py-8">
        <div class="px-6 mx-auto max-w-7xl lg:px-8">
          <!-- 购买套餐 -->
          <div class="max-w-4xl mx-auto text-center">
            <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">购买套餐</p>
            <div class="mt-4 text-2xl font-bold leading-8 text-teal-500 animate-pulse">早期尝鲜价格</div>
          </div>

          <!-- 套餐列表 -->
          <div class="grid grid-cols-1 gap-6 mx-auto mt-10 isolate md:grid-cols-2 lg:grid-cols-4 xl:mx-0">
            <div
              v-for="tier in state.products"
              :key="tier.id"
              class="p-4 rounded-2xl lg:p-8"
              :class="[
                tier.mostPopular && !userStore.getFirstPurchase
                  ? 'ring-4 ring-teal-500 hover:shadow-lg delay-100 duration-200 hover:scale-105'
                  : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-teal-500 hover:shadow-lg delay-100 duration-200 hover:scale-105',
              ]"
            >
              <div class="flex items-center justify-between gap-x-4">
                <h3 v-if="tier.isDiscount" :id="tier.id" class="text-xl font-semibold leading-8 text-teal-500">
                  {{ tier.isDiscount ? `${tier.description} 折` : '' }}
                </h3>
                <h3 v-else :id="tier.id" class="text-xl font-semibold leading-8 text-transparent">
                  {{ `${tier.description * 10}折` }}
                </h3>
                <p
                  v-if="tier.isDiscount"
                  class="rounded-full bg-teal-500/10 py-1 px-2.5 text-md font-semibold leading-5 text-teal-500"
                >
                  {{ tier.mostPopular ? '首次充值专享' : '优惠' }}
                </p>
              </div>
              <div class="flex items-center justify-center mt-8">
                <h3 :id="tier.id" class="text-3xl font-semibold leading-8 text-gray-900">
                  {{ `${tier.credit} 积分` }}
                </h3>
              </div>
              <div class="flex items-baseline justify-center mt-6 gap-x-1">
                <div>
                  <span class="text-xl font-bold tracking-tight text-gray-900">￥</span>
                  <span class="text-4xl font-bold tracking-tight text-gray-900">{{ ` ${tier.price}` }}</span>
                </div>
                <span v-if="tier.isDiscount" class="ml-2 text-lg font-normal leading-6 text-gray-400 line-through">{{
                  `${tier.originalPrice}`
                }}</span>
              </div>
              <div
                v-if="!tier.mostPopular || userStore.getFirstPurchase"
                :aria-describedby="tier.id"
                class="block px-3 py-2 mt-6 text-sm font-semibold leading-6 text-center rounded-md cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                :class="[
                  tier.mostPopular
                    ? 'bg-teal-500 text-white shadow-sm hover:bg-teal-400'
                    : 'text-teal-500 ring-2 ring-inset ring-gray-200 hover:bg-gray-100',
                ]"
                @click="handleOrder(tier.id)"
              >
                立即购买
              </div>
              <NModal
                v-model:show="state.showModal"
                class="custom-card"
                preset="card"
                :show-icon="false"
                aria-modal="true"
                :style="bodyStyle"
                size="huge"
                title="订单支付"
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
                              <p class="text-teal-600">{{ ` ${item.value}` }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-center justify-center mt-6 md:base-2/3 md:mt-0">
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
                      <NButton strong secondary round type="success" class="mr-4" @click="handleClose">
                        稍后支付
                      </NButton>
                    </div>
                    <div v-if="isMobile" class="flex justify-start mt-6">
                      <span>暂不支持手机端支付，请移步电脑端进行操作</span>
                    </div>
                  </div>

                  <template #description>
                    <NTag :bordered="false" type="success">
                      <p class="text-lg font-medium">正在下单...</p>
                    </NTag>
                  </template>
                </NSpin>
              </NModal>
            </div>
          </div>

          <!-- 套餐说明 -->
          <div class="mt-10 text-sm text-slate-600">
            <p>
              <span class="ml-1">支付满 500 元可联系</span>
              <NPopover trigger="hover">
                <template #trigger>
                  <span class="underline">客服</span>
                </template>
                <img :src="QrCodeImg" alt="Contact Us" class="w-40 h-40" />
              </NPopover>
              <span>开具发票</span>
            </p>
            <p>
              <span class="ml-1">我们提供大规模 API 调用服务，详情可咨询</span>
              <NPopover trigger="hover">
                <template #trigger>
                  <span class="underline">客服</span>
                </template>
                <img :src="QrCodeImg" alt="Contact Us" class="w-40 h-40" />
              </NPopover>
            </p>
            <p>* 按照输入500 tokens，输出500 tokens进行估算</p>
          </div>

          <div class="my-4 text-xl">
            <p>计费规则</p>
            <NDataTable :columns="columns" :data="data" :single-line="false" class="my-4 text-xs" />
            <div class="list-disc list-inside">
              <p class="my-0.5 flex items-start gap-x-2 text-sm">
                <span>* 什么是token:</span
                ><a class="text-teal-500" href="https://zhuanlan.zhihu.com/p/608783584"
                  >https://zhuanlan.zhihu.com/p/608783584</a
                >
              </p>
              <p class="my-0.5 flex items-start gap-x-2 text-sm">
                <span>* 在线token计算:</span
                ><a class="text-teal-500" href="https://platform.openai.com/tokenizer"
                  >https://platform.openai.com/tokenizer</a
                >
              </p>
            </div>
          </div>

          <!-- 消费记录 -->
          <Record />
        </div>
      </div>
    </NLayout>
  </div>
</template>
