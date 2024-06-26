<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import {
  NButton,
  NCard,
  NForm,
  NFormItemRow,
  NInput,
  NModal,
  NNumberAnimation,
  NPagination,
  useMessage,
} from 'naive-ui'
import { useClipboard } from '@vueuse/core'
import BindEmail from './bind-email.vue'
import IncentiveWithdrawal from './incentive-withdrawal.vue'
import { useUserStoreWithOut } from '@/store'
import 'dayjs/locale/zh-cn'
import { SvgIcon } from '@/components/common'
import api from '@/api'
import inviteImage from '@/assets/svg/invite.svg'
import { isValidEmail, isValidPassword } from '@/utils/format'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const userStore = useUserStoreWithOut()

const avatar = userStore.getAvatar

const stats = ref([
  { id: 'invite', title: '邀请人数', value: 0, precision: 0, icon: 'solar:hand-stars-linear' },
  { id: 'experience', title: '体验奖励', value: 0, precision: 0, icon: 'solar:donut-outline' },
  { id: 'cash', title: '现金奖励', value: 0, precision: 2, icon: 'solar:cash-out-linear' },
])

const message = useMessage()

const page = ref(1)
const limit = ref(10)
const count = ref(0)
const incomes = ref<any[]>([])
const disabled = ref(false)

async function updatePage(val: number) {
  page.value = val
  disabled.value = true
  await fetchInviteIncomes()
  disabled.value = false
}

const bindEmailDialog = ref(false)

function openBindEmailDialog() {
  bindEmailDialog.value = true
}

function closeBindEmailDialog() {
  bindEmailDialog.value = false
}

const isEmailBind = computed(() => !!userStore.getEmail)

const withdrawalDialog = ref(false)

const withdrawalAmount = computed(() => userStore.getWithdraw)

function openWithdrawalDialog() {
  withdrawalDialog.value = true
}

function closeWithdrawalDialog() {
  withdrawalDialog.value = false
}

const invitationCode = computed(() => userStore.getInviteCode)

const invitationLink = computed(() => `${import.meta.env.VITE_SERVE_URL}/signup?invite_code=${invitationCode.value}`)

const invitePromo = computed(
  () =>
    `向大家强烈推荐一个方便好用的 ChatGPT 工具，叫一粟创作助手。写作业、写材料、写代码，都能轻松搞定！助力工作、学习、生活，创作无极限！海量模板，迸发灵感，提升效率！详情可见：https://ai.yisukeyan.com/。通过下方链接注册还可获赠 10 次免费体验：${invitationLink.value}`,
)

const { text, copy, copied, isSupported } = useClipboard({ legacy: true, source: invitationCode.value as string })

const {
  text: linkText,
  copy: linkCopy,
  copied: linkCopied,
  isSupported: linkIsSupported,
} = useClipboard({ legacy: true, source: invitationLink.value })

const {
  copy: promoCopy,
  copied: promoCopied,
  isSupported: promoIsSupported,
} = useClipboard({
  legacy: true,
  source: invitePromo.value,
})
onMounted(() => {
  fetchInviteIncomes()
})

watch(
  [userStore.getInviteeCount, userStore.getCallCount, userStore.getWithdraw],
  () => {
    for (let i = 0; i < stats.value.length; i++) {
      const item = stats.value[i]
      if (item.id === 'invite') {
        item.value = userStore.getInviteeCount
      } else if (item.id === 'experience') {
        item.value = userStore.getInviteeCredit
      } else if (item.id === 'cash') {
        item.value = userStore.getWithdraw
      }
    }
  },
  { immediate: true },
)

const rules = [
  { id: 1, text: '成功邀请新用户完成注册并绑定邮箱，您和新用户都将获得 1 积分！' },
  {
    id: 2,
    text: '您邀请的新用户首次充值时，您将获得 20% 的现金奖励！例如，新用户首次充值了 100 元，您将获得 20 元的奖励。',
  },
  { id: 3, text: '现金奖励累积到 50 元可提现!' },
]

async function fetchInviteIncomes() {
  try {
    const res: any = await api.getInviteIncomeApi({ page: page.value, limit: limit.value })
    count.value = res.total_count
    incomes.value = res.incomes
  } catch (err) {
    console.error('fetch invite incomes error:', err)
    count.value = 0
    incomes.value = []
  }
}

function copyInviteCode() {
  copy(invitationCode.value as string)
  message.success('邀请码已复制到剪贴板')
}

function copyInviteLink() {
  linkCopy(invitationLink.value as string)
  message.success('邀请链接已复制到剪贴板')
}

function copyInvitePromo() {
  promoCopy(invitePromo.value)
  message.success('邀请文案已复制到剪贴板')
}

// change password
const showPasswordModal = ref<any>(false)

const refPassChange = ref<any>(null)
const modelPassChange = ref<any>({
  code: null,
  oldPassword: null,
  newPassword: null,
  confirmedPassword: null,
})
const refPassConfirm = ref<any>(null)
const useEmail2ChangePass = ref<any>(false)

function onReset() {
  showPasswordModal.value = true
}

function afterLeave() {
  // 重置 modelPassChange
  modelPassChange.value = {
    code: null,
    oldPassword: null,
    newPassword: null,
    confirmedPassword: null,
  }
  useEmail2ChangePass.value = false
}

const validatePasswordStartWith = (rule: any, value: any) => {
  return (
    !!modelPassChange.value.newPassword &&
    modelPassChange.value.newPassword.startsWith(value) &&
    modelPassChange.value.newPassword.length >= value.length
  )
}
const validatePasswordSame = (rule: any, value: any) => {
  return value === modelPassChange.value.newPassword
}
const handlePasswordInput = () => {
  if (modelPassChange.value.confirmedPassword) {
    refPassConfirm.value?.validate({ trigger: 'password-input' })
  }
}

const formPassChangeRules = {
  code: [
    {
      key: 'code',
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
  oldPassword: [
    {
      key: 'old',
      required: true,
      message: '请输入旧密码',
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      required: true,
      validator(rule: any, value: any) {
        if (!value) {
          return new Error('请输入新密码')
        } else if (!isValidPassword(value)) {
          return new Error('密码应为 8~32 位，且包含数字或字母')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
  confirmedPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

const loadPassChange = ref(false)
const handlePassChangeClick = async (e: any) => {
  e.preventDefault()
  const useEmail = useEmail2ChangePass.value
  refPassChange.value?.validate(
    async (err: any) => {
      if (!err) {
        loadPassChange.value = true
        try {
          if (useEmail) {
            await api.resetPasswordApi({
              email: userStore.email,
              code: modelPassChange.value.code,
              password: modelPassChange.value.newPassword,
            })
            message.success('密码重置成功')
          } else {
            await api.updatePasswordApi({
              old_password: modelPassChange.value.oldPassword,
              new_password: modelPassChange.value.newPassword,
            })
            message.success('密码更改成功')
          }
        } catch (_err: any) {
          console.error(_err)
          if (useEmail) {
            message.error(`密码重置失败，${_err.error.message}`)
          } else {
            message.error(`密码更改失败，${_err.error.message}`)
          }
        } finally {
          modelPassChange.value = {
            code: null,
            oldPassword: null,
            newPassword: null,
            confirmedPassword: null,
          }
          loadPassChange.value = false
        }
      } else {
        console.error(err)
        message.error('请按提示正确填写内容')
      }
      showPasswordModal.value = false
    },
    (rule: any) => {
      return rule?.key !== (useEmail ? 'old' : 'code')
    },
  )
}

// send verify code
const loadEmailCode = ref(false)
const freezeEmailCode = ref(false)
const countDown = ref(60)

const handleSendEmailCode = async (email: any) => {
  if (!isValidEmail(email)) {
    message.error('邮箱地址不合法')
    return
  }
  loadEmailCode.value = true
  try {
    await api.sendCodeApi({ category: 'email', email })
    message.success('验证码已发送，请注意查收')
    freezeEmailCode.value = true
    const timer = setInterval(() => {
      countDown.value--
      if (countDown.value === 0) {
        clearInterval(timer)
        freezeEmailCode.value = false
        countDown.value = 30
      }
    }, 1000)
  } catch (err: any) {
    console.error(err)
    message.error(`验证码发送失败，${err.error.message}`)
  } finally {
    loadEmailCode.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
    <div class="">
      <div class="overflow-hidden rounded-lg shadow bg-slate-100/40">
        <div>
          <div class="h-32 bg-cover sm:h-40 lg:h-60 bg-world-map"></div>

          <div class="-mt-16">
            <div class="flex justify-center">
              <img :src="avatar" class="w-32 h-32 align-middle rounded-full ring-8 ring-white" />
            </div>
          </div>

          <div
            class="items-start max-w-2xl grid-cols-1 grid-rows-1 px-4 mx-auto mt-16 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none"
          >
            <div class="">
              <div class="rounded-lg shadow-sm bg-gray-50 ring-1 ring-gray-900/5">
                <dl class="flex flex-wrap">
                  <div class="flex-auto pt-6 pl-6">
                    <span class="font-bold text-md text-slate-600">积分</span>
                    <dd class="flex items-baseline gap-4 mt-1 text-xl font-semibold leading-6">
                      <span
                        class="text-transparent bg-gradient-to-r text-3xl from-teal-500 from-10% to-teal-300 to-30% bg-clip-text"
                      >
                        {{ userStore.getCredit }}
                      </span>
                    </dd>
                  </div>
                  <div class="flex flex-none w-full px-6 pt-6 mt-6 border-t gap-x-4 border-gray-900/5">
                    <dt class="flex-none">
                      <span class="sr-only">Client</span>
                      <SvgIcon icon="ph:user-circle-duotone" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                    </dt>
                    <dd class="text-sm font-medium leading-6 text-gray-900">{{ userStore.getUsername }}</dd>
                  </div>
                  <div class="flex flex-none w-full px-6 mt-4 gap-x-4">
                    <dt class="flex-none">
                      <span class="sr-only">Due date</span>
                      <SvgIcon icon="ph:calendar-duotone" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                    </dt>
                    <dd class="text-sm leading-6 text-gray-500">
                      <time datetime="2023-01-31">创建于{{ dayjs().to(userStore.getCreatedAt) }}</time>
                    </dd>
                  </div>
                  <div class="flex items-center justify-between w-full pr-4 my-3">
                    <div class="flex w-full px-6 gap-x-4">
                      <dt class="flex-none">
                        <span class="sr-only">Status</span>
                        <SvgIcon icon="ph:envelope-simple-duotone" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                      </dt>
                      <dd class="flex items-center justify-between w-full text-sm leading-6 text-gray-500">
                        <span>{{ userStore.getEmail ? userStore.getEmail : '未绑定' }}</span>
                      </dd>
                    </div>
                    <span
                      class="px-2 py-0.5 hover:rounded-lg text-xs text-teal-500 cursor-pointer whitespace-nowrap hover:bg-teal-500/5"
                      @click="openBindEmailDialog"
                      >{{ isEmailBind ? '修改' : '绑定' }}</span
                    >
                  </div>
                  <BindEmail :open="bindEmailDialog" :is-email-bind="isEmailBind" @close="closeBindEmailDialog" />
                </dl>
                <div class="px-4 pb-4 mt-6 border-t border-gray-900/5">
                  <div
                    class="flex justify-between flex-none w-full px-2 py-2 mt-4 cursor-pointer hover:rounded-lg gap-x-4 hover:bg-slate-100"
                    @click="onReset"
                  >
                    <div class="flex items-center gap-x-4">
                      <dt class="flex-none">
                        <span class="sr-only">password</span>
                        <SvgIcon icon="ph:fingerprint-duotone" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                      </dt>
                      <dd class="text-sm leading-6 text-gray-500">修改密码</dd>
                    </div>
                    <SvgIcon icon="solar:alt-arrow-right-linear" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <NModal v-model:show="showPasswordModal" :mask-closable="false" @after-leave="afterLeave">
                    <NCard
                      style="width: 600px"
                      title="更改密码"
                      :bordered="false"
                      size="huge"
                      role="dialog"
                      aria-modal="true"
                    >
                      <template #header-extra>
                        <button
                          class="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-md focus:outline-none"
                          @click="showPasswordModal = false"
                        >
                          <SvgIcon icon="ph:x" class="w-4 h-4 text-gray-400" aria-hidden="true" />
                        </button>
                      </template>
                      <NForm ref="refPassChange" :model="modelPassChange" :rules="formPassChangeRules">
                        <NFormItemRow v-if="useEmail2ChangePass" label="验证码" path="code">
                          <NInput v-model:value="modelPassChange.code" placeholder="请输入验证码" class="mr-2" />
                          <NButton
                            type="primary"
                            dashed
                            :disabled="freezeEmailCode"
                            :loading="loadEmailCode"
                            @click="handleSendEmailCode(userStore.email)"
                          >
                            <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                            <span v-else>获取验证码</span>
                          </NButton>
                        </NFormItemRow>
                        <NFormItemRow v-else label="旧密码" path="oldPassword">
                          <NInput
                            v-model:value="modelPassChange.oldPassword"
                            placeholder="请输入旧密码"
                            type="password"
                            @keydown.enter.prevent
                          />
                        </NFormItemRow>
                        <NFormItemRow label="新密码" path="newPassword">
                          <NInput
                            v-model:value="modelPassChange.newPassword"
                            placeholder="请输入新密码"
                            type="password"
                            @input="handlePasswordInput"
                            @keydown.enter.prevent
                          />
                        </NFormItemRow>
                        <NFormItemRow ref="refPassConfirm" label="确认新密码" path="confirmedPassword" first>
                          <NInput
                            v-model:value="modelPassChange.confirmedPassword"
                            placeholder="请再次输入新密码"
                            :disabled="!modelPassChange.newPassword"
                            type="password"
                            @keydown.enter.prevent
                          />
                        </NFormItemRow>
                      </NForm>
                      <div v-if="isEmailBind" class="flex justify-end">
                        <NButton quaternary type="primary" @click="useEmail2ChangePass = !useEmail2ChangePass">
                          <span v-if="useEmail2ChangePass">收不到验证码？改用密码验证 </span>
                          <span v-else>不记得旧密码？改用邮箱认证</span>
                          <SvgIcon icon="ph:caret-double-right-light" class="w-4 h-4 ml-1" aria-hidden="true" />
                        </NButton>
                      </div>
                      <template #footer>
                        <div class="flex justify-end">
                          <NButton
                            :disabled="
                              !modelPassChange.newPassword ||
                              !modelPassChange.confirmedPassword ||
                              modelPassChange.newPassword !== modelPassChange.confirmedPassword
                            "
                            type="primary"
                            :loading="loadPassChange"
                            @click="handlePassChangeClick"
                          >
                            更改
                          </NButton>
                        </div>
                      </template>
                    </NCard>
                  </NModal>
                  <div
                    class="flex justify-between flex-none w-full px-2 py-2 mt-4 cursor-pointer hover:rounded-lg gap-x-4 hover:bg-slate-100"
                    @click="openWithdrawalDialog"
                  >
                    <div class="flex items-center gap-x-4">
                      <dt class="flex-none">
                        <span class="sr-only">password</span>
                        <SvgIcon icon="ph:money-duotone" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                      </dt>
                      <dd class="text-sm leading-6 text-gray-500">奖励提现</dd>
                    </div>
                    <SvgIcon icon="solar:alt-arrow-right-linear" class="w-6 h-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <IncentiveWithdrawal
                    :open="withdrawalDialog"
                    :amount="withdrawalAmount"
                    @close="closeWithdrawalDialog"
                  />
                </div>
              </div>

              <div
                class="mt-8 bg-gradient-to-br from-indigo-200/40 from-5% via-sky-50/10 via-10% to-white to-20% rounded-lg shadow-sm ring-1 ring-gray-900/5"
              >
                <img :src="inviteImage" class="h-28 w-28 mt" />
                <div class="px-4 pb-4">
                  <h1 class="text-2xl font-bold text-slate-600">邀请朋友赚取佣金</h1>
                  <p class="mt-2 text-sm font-normal text-slate-400">
                    新用户通过您的邀请码注册并使用时，您将获得可观的奖励！
                  </p>

                  <button
                    v-if="isSupported"
                    type="button"
                    class="relative inline-flex items-center justify-between w-full px-2 py-1 mt-6 font-mono text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    @click="copyInviteCode"
                  >
                    {{ text || invitationCode }}
                    <span class="border-s ps-3.5 dark:border-gray-700">
                      <SvgIcon
                        v-if="!copied"
                        icon="ph:clipboard-duotone"
                        class="w-4 h-4 text-gray-400 hover:origin-center hover:rotate-12 hover:text-slate-600 hover:scale-105"
                        aria-hidden="true"
                      />
                      <SvgIcon v-else class="w-4 h-4 text-emerald-500" icon="ph:check-bold" />
                    </span>
                  </button>
                  <p class="w-full text-sm text-center text-slate-500">Or</p>
                  <button
                    v-if="linkIsSupported"
                    type="button"
                    class="relative inline-flex items-center justify-between w-full px-2 py-1 font-mono text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm text-start gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    @click="copyInviteLink"
                  >
                    <span class="overflow-hidden">{{ linkText || invitationLink }}</span>
                    <span class="border-s ps-3.5 dark:border-gray-700 w-4">
                      <SvgIcon
                        v-if="!linkCopied"
                        icon="ph:clipboard-duotone"
                        class="w-4 h-4 text-gray-400 hover:origin-center hover:rotate-12 hover:text-slate-600 hover:scale-105"
                        aria-hidden="true"
                      />
                      <SvgIcon v-else class="w-4 h-4 text-emerald-500" icon="ph:check-bold" />
                    </span>
                  </button>
                </div>

                <div class="relative">
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-gray-300" />
                  </div>
                  <div class="relative flex justify-center">
                    <span class="px-2 text-sm text-gray-500 bg-gray-50">奖励规则</span>
                  </div>
                </div>

                <ul role="list" class="px-4 divide-y divide-gray-200">
                  <li v-for="item in rules" :key="item.id" class="py-4">
                    <div class="flex items-start gap-2 text-sm text-indigo-900">
                      <span>{{ item.id }}. </span>
                      <span>{{ item.text }}</span>
                    </div>
                  </li>
                </ul>

                <div class="px-4 pb-4 border-t border-gray-900/5">
                  <div class="flex justify-center flex-none w-full px-2 py-2 mt-4 cursor-pointer gap-x-4">
                    <button
                      v-if="promoIsSupported"
                      type="button"
                      class="inline-flex items-center gap-x-1.5 rounded-lg bg-indigo-600/5 px-3 py-2 text-sm font-semibold text-indigo-500 shadow-sm hover:bg-indigo-600/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      @click="copyInvitePromo"
                    >
                      <SvgIcon
                        v-if="!promoCopied"
                        icon="solar:document-text-linear"
                        class="w-5 h-5"
                        aria-hidden="true"
                      />
                      <SvgIcon v-else class="w-5 h-5 text-emerald-500" icon="ph:check-bold" />
                      <span>{{ promoCopied ? '复制成功' : '邀请文案' }}</span>
                    </button>
                    <!-- <button
                      type="button"
                      class="inline-flex items-center gap-x-1.5 rounded-lg bg-indigo-600/5 px-3 py-2 text-sm font-semibold text-indigo-500 shadow-sm hover:bg-indigo-600/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <SvgIcon icon="solar:gallery-minimalistic-linear" class="w-5 h-5" aria-hidden="true" />
                      <span>邀请图片</span>
                    </button> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-8 sm:rounded-lg sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <div>
                <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div
                    v-for="item in stats"
                    :key="item.title"
                    class="relative px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-4 ring-1 ring-gray-800/5"
                  >
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ item.title }}</dt>
                    <dd class="flex items-end justify-between mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                      <NNumberAnimation :from="0" :to="item.value" :precision="item.precision" active show-separator />
                    </dd>
                    <div class="absolute top-4 right-4">
                      <SvgIcon :icon="item.icon" class="w-8 h-8 text-teal-500" aria-hidden="true" />
                    </div>
                  </div>
                </dl>
              </div>
              <div class="mt-8">
                <div class="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">奖励</th>
                        <th
                          scope="col"
                          class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          时间
                        </th>
                        <th
                          scope="col"
                          class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                          来源
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="income in incomes" :key="income.id">
                        <td
                          class="w-full py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-0 sm:w-auto sm:max-w-none"
                        >
                          {{ income.description }}
                          <dl class="font-normal lg:hidden">
                            <dt class="sr-only">Title</dt>
                            <dd class="mt-1 text-gray-700 truncate">
                              {{ dayjs(income.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                            </dd>
                            <dt class="sr-only sm:hidden">Email</dt>
                            <dd class="mt-1 text-gray-500 truncate sm:hidden">{{ income.action }}</dd>
                          </dl>
                        </td>
                        <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                          {{ dayjs(income.created_at).format('YYYY-MM-DD HH:mm:ss') }}
                        </td>
                        <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ income.action }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex justify-end mt-2">
                  <NPagination
                    :page="page"
                    :item-count="count"
                    :page-size="limit"
                    :disabled="disabled"
                    :page-slot="6"
                    @update:page="updatePage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
