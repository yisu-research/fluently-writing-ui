<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { NButton, useMessage, useNotification } from 'naive-ui'
import LayoutHeader from '@/layout/layout-header/index.vue'
import LayoutMain from '@/layout/layout-main/index.vue'
import LayoutSidebar from '@/layout/layout-sidebar/index.vue'
import { useAppStoreWithOut, useUserStoreWithOut } from '@/store'
import { Gender } from '@/store/modules/user/helper'
import manImage from '@/assets/images/man.png'
import womanImage from '@/assets/images/woman.png'
import { formatDate } from '@/utils/format'

const sidebarOpen = ref(false)

const userStore = useUserStoreWithOut()

const appStore = useAppStoreWithOut()

onMounted(() => {
  initData()
})

async function initData() {
  // 用户数据
  await userStore.fetchProfile()

  // 用户性别
  const gender = userStore.getGender

  if (!userStore.getAvatar) {
    // 设置用户头像
    if (gender === Gender.Man) {
      userStore.setAvatar(manImage)
    } else {
      userStore.setAvatar(womanImage)
    }
  }
}

const message = useMessage()
const notification = useNotification()

function handleClick2() {
  let markAsRead = false
  const n = notification.create({
    title: '升级日志',
    content: `1. 计费系统升级
平台计费系统全新升级，由“次数”升级成“积分”。已有“次数”统一按10:1折算成新的“积分”，后续也会统一按照“积分”进行计费。感谢大家的支持～为了回馈老用户，平台给每位用户都额外充值了10积分（大约100次ChatGPT单轮对话 或者 5次GPT4单轮对话）。
2. 支持无限轮对话
ChatGPT支持 32K tokens上下文（约75页文本），可以连续对话数十轮
GPT4支持128K tokens的超长上下文（约300页文本），可以几乎“无限轮”对话
* 因为需要拼接历史对话内容，多轮对话会加速“积分”消耗数量。每次积分消耗详情参见“对话回复 - 右下角 - 本次详情”
3. 支持清空历史对话
在聊天框支持「清空历史」，不用再开启新的聊天框就能开启全新对话
*「清空历史」能有效降低“积分”消耗数量`,
    meta: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    action: () =>
      h(
        NButton,
        {
          text: true,
          type: 'primary',
          onClick: () => {
            markAsRead = true
            appStore.setV4Notice(false)
            n.destroy()
          },
        },
        {
          default: () => '已读',
        },
      ),
    onClose: () => {
      if (!markAsRead) {
        message.warning('请设为已读')
        return false
      }
    },
  })
}

onMounted(() => {
  if (appStore.getV4Notice) {
    handleClick2()
  }
})
</script>

<template>
  <div class="">
    <LayoutSidebar v-model:sidebar-open="sidebarOpen" />
    <div class="h-screen lg:pl-72">
      <LayoutHeader v-model:sidebar-open="sidebarOpen" />
      <LayoutMain />
    </div>
  </div>
</template>
