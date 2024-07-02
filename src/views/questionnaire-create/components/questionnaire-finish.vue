<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import  { ModelType, type QuestionnaireType } from '@/store/modules/questionnaire/helper';

const props = defineProps<{
    questionnaireTmp: QuestionnaireType,
    step: number
}>()
const emit = defineEmits(['update:questionnaireTmp','update:step'])
const { questionnaireTmp } = toRefs(props)

watch(questionnaireTmp, async (newQ,oldQ) => {
    emit('update:questionnaireTmp', newQ)
})

const agentsCount = computed(() => {
    const count = ref(0)
    for(let i=0; i<questionnaireTmp.value.agents.length; ++i) {
        count.value += questionnaireTmp.value.agents[i].number
    }
    return count
})
const questionCount = computed(() => {
    return questionnaireTmp.value.question.length
})

const selectedModel = ref(ModelType.gpt4o)

function goToLastStep() {
    emit('update:step', 1)
}

function debugWriting() {
    
}

</script>

<template>
    <div>
        <!-- FAQ -->
        <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

        <div class="max-w-xl mx-auto">
            <!-- Grid -->
            <div class="grid sm:grid-cols-1 gap-6 md:gap-12 ">
            <div class="flex flex-row place-self-left space-x-40 ">
                <h3 class="w-[100px] text-lg font-semibold text-gray-800 dark:text-neutral-200 ">
                问卷名称
                </h3>
                <p class="mt-1 text-gray-600 dark:text-neutral-400 ">
                    {{ questionnaireTmp.name }}
                </p>
            </div>
            <!-- End Col -->

            <div class="flex flex-row place-self-left space-x-40 ">
                <h3 class="w-[100px] text-lg font-semibold text-gray-800 dark:text-neutral-200">
                预览链接
                </h3>
                <p class="mt-1 text-gray-600 dark:text-neutral-400 ">
                    {{ questionnaireTmp.url }}
                </p>
            </div>
            <!-- End Col -->

            <div class="flex flex-row place-self-left space-x-40 ">
                <h3 class="w-[100px] text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Agents数量
                </h3>
                <p class="mt-1 text-gray-600 dark:text-neutral-400  ">
                    {{ agentsCount }}
                </p>
            </div>
            <!-- End Col -->

            <div class="flex flex-row place-self-left space-x-40 ">
                <h3 class="w-[100px] text-lg font-semibold text-gray-800 dark:text-neutral-200">
                题目数量
                </h3>
                <p class="mt-1 text-gray-600 dark:text-neutral-400">
                    {{ questionCount }}
                </p>
            </div>
            <!-- End Col -->

            <div class="flex flex-row place-self-left space-x-40 ">
                <h3 class="w-[100px] text-lg font-semibold text-gray-800 dark:text-neutral-200">
                模型
                </h3>
                <div>
                    <Listbox v-model="selectedModel">
                        <div class="relative mt-1">
                            <ListboxButton
                            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                            >
                            <span class="block truncate">{{ selectedModel }}</span>
                            <span
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                            >
                                <ChevronUpDownIcon
                                class="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                                />
                            </span>
                            </ListboxButton>

                            <transition
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                            >
                            <ListboxOptions
                                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                            >
                                <ListboxOption
                                v-slot="{ active, selected }"
                                v-for="(item, index) in ModelType"
                                :key="index"
                                :value="item"
                                as="template"
                                >
                                <li
                                    class="relative cursor-default select-none py-2 pl-10 pr-4" :class="[
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                                    ]"
                                >
                                    <span
                                    class="block truncate" :class="[
                                        selected ? 'font-medium' : 'font-normal',
                                    ]"
                                    >{{ item }}</span
                                    >
                                    <span
                                    v-if="selected"
                                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                    >
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                    </span>
                                </li>
                                </ListboxOption>
                            </ListboxOptions>
                            </transition>
                        </div>
                        </Listbox>
                </div>
            </div>
            <!-- End Col -->

            <div class="flex flex-row justify-center">
                <button 
                        type="button" 
                        class="w-[100px] h-[30px] mt-[50px] text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='goToLastStep'
                        >
                        上一步
                </button>
                <button 
                        type="button" 
                        class="w-[100px] h-[30px] ml-[250px] mt-[50px] text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='debugWriting'
                        >
                        填写调试
                </button>
            </div>
            <!-- End Col -->

            </div>
            <!-- End Grid -->
        </div>
        </div>
        <!-- End FAQ -->
    </div>
</template>

<style scoped></style>