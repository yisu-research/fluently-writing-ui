<script setup lang="ts">
import ContactUs from '@/views/home/components/ContactUs.vue'
import FeatureSectionAssignment from '@/views/home/components/FeatureSectionAssignment.vue'
import FeatureSectionCoding from '@/views/home/components/FeatureSectionCoding.vue'
import FeatureSectionExam from '@/views/home/components/FeatureSectionExam.vue'
import FeatureSectionLife from '@/views/home/components/FeatureSectionLife.vue'
import FeatureSectionReport from '@/views/home/components/FeatureSectionReport.vue'
import FeatureSectionTemplate from '@/views/home/components/FeatureSectionTemplate.vue'
import FeatureSectionWork from '@/views/home/components/FeatureSectionWork.vue'
import FooterSection from '@/views/home/components/FooterSection.vue'
import HeroSection from '@/views/home/components/HeroSection.vue'
</script>

<template>
  <HeroSection />
  <FeatureSectionAssignment />
  <FeatureSectionReport />
  <FeatureSectionWork />
  <FeatureSectionCoding />
  <FeatureSectionExam />
  <FeatureSectionLife />
  <FeatureSectionTemplate />
  <ContactUs />
  <FooterSection />
</template>
