<script setup lang="ts">
import HomeHeader from './components/home-header/index.vue'
import HomeHero from './components/home-hero/index.vue'
import SectionImageRight from './components/section-image/index.vue'
import SectionTemplate from './components/section-template/index.vue'
import ContactUs from './components/contact-us/index.vue'
import HomeFooter from './components/home-footer/index.vue'
import EnglishWritingImg from '@/assets/images/english_writing.png'
import CodingImage from '@/assets/images/coding.png'
import WorkImage from '@/assets/images/work.png'
import PracticeReportImage from '@/assets/images/report.png'
import ExamImage from '@/assets/images/exam.png'
import LifeImage from '@/assets/images/life.png'

const features = [
  {
    title: '助写作业',
    subTitle: '依托海量知识储备，帮助您快速完成各科作业',
    image: EnglishWritingImg,
    items: [
      {
        name: '助写英语作文，',
        description: '用法地道，逻辑严谨',
        icon: 'solar:document-add-bold-duotone',
      },
      {
        name: '助写实验报告，',
        description: '数据翔实，分析深入',
        icon: 'solar:graph-new-bold-duotone',
      },
      {
        name: '助写结课论，',
        description: '引用规范，论据充分',
        icon: 'solar:diploma-bold-duotone',
      },
    ],
  },
  {
    title: '助写代码',
    subTitle: '人人都是程序员，给出需求，立刻帮您码好代码',
    image: CodingImage,
    items: [
      {
        name: '助写Python，',
        description: '数据分析，机器学习',
        icon: 'solar:pulse-bold-duotone',
      },
      {
        name: '助写Java，',
        description: '后端开发，桌面应用',
        icon: 'solar:monitor-smartphone-bold-duotone',
      },
      {
        name: '助写C++，',
        description: '算法设计，图形学',
        icon: 'solar:face-scan-square-bold-duotone',
      },
    ],
  },
  {
    title: '助力工作',
    subTitle: '帮你从繁杂的工作中解放出来',
    image: WorkImage,
    items: [
      {
        name: '从大段录音文本中，',
        description: '一键出会议纪要',
        icon: 'solar:camera-square-bold-duotone',
      },
      {
        name: '简单说说工作进展，',
        description: '一键扩写好周报',
        icon: 'solar:shuffle-bold-duotone',
      },
      {
        name: '告别反复来回检查，',
        description: '一键纠错与润色',
        icon: 'solar:radar-2-bold-duotone',
      },
    ],
  },
  {
    title: '助写材料',
    subTitle: '仅需几个关键词，帮助您快速搞定各种材料',
    image: PracticeReportImage,
    items: [
      {
        name: '助写个人简历，',
        description: '排版精美，亮点突出',
        icon: 'solar:clapperboard-edit-bold-duotone',
      },
      {
        name: '助写活动宣传，',
        description: '语言生动，形式多样',
        icon: 'solar:checklist-minimalistic-bold-duotone',
      },
      {
        name: '助写实践报告，',
        description: '结构清晰，内容详尽',
        icon: 'solar:clipboard-list-bold-duotone',
      },
    ],
  },
  {
    title: '助力备考',
    subTitle: '帮您高效准备各类学科考试',
    image: ExamImage,
    items: [
      {
        name: '雅思作文批改，',
        description: '给分数还给建议',
        icon: 'solar:bill-check-bold-duotone',
      },
      {
        name: '类似习题生成，',
        description: '错题就多多联系',
        icon: 'solar:bill-list-bold-duotone',
      },
      {
        name: '疑难答案详解，',
        description: '帮助你彻底搞懂',
        icon: 'solar:chat-unread-bold-duotone',
      },
    ],
  },
  {
    title: '助力生活',
    subTitle: '生活中的各种琐事都可以来试试',
    image: LifeImage,
    items: [
      {
        name: '您的心理医生，',
        description: '在线给你正能量',
        icon: 'solar:hearts-bold-duotone',
      },
      {
        name: '您的资深导游，',
        description: '吃喝玩乐都很懂',
        icon: 'solar:user-id-bold-duotone',
      },
      {
        name: '您的穿搭顾问，',
        description: '时尚搭配不错过',
        icon: 'solar:skirt-bold-duotone',
      },
    ],
  },
]
</script>

<template>
  <HomeHeader />
  <HomeHero />
  <template v-for="(content, index) in features" :key="content.title">
    <SectionImageRight :content="content" :position="index % 2 === 0 ? 'right' : 'left'" />
  </template>
  <SectionTemplate />
  <ContactUs />
  <HomeFooter />
</template>
