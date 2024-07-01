<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuestionnaire } from '../hooks/useQuestionnaire'
import { type QuestionnaireType, type QuestionType, type OptionType, useQuestionnaireStoreWithOut } from '@/store/modules/questionnaire';
import { ModelType, Question } from '@/store/modules/questionnaire/helper'
import { deepClone } from '@/utils/deepClone'


const questionnaireStore = useQuestionnaireStoreWithOut()
const { render } = useQuestionnaire()


const people = [
    { name: '单选题' },
    { name: '多选题' },
    { name: '问答题' },
]
const selectedPerson = ref({name: '请选择题目类型'})
const questionTypeMap = new Map<string, Question>()
function addQuestionTypeMapItem() {
    questionTypeMap.set('单选题', Question.single)
    questionTypeMap.set('多选题', Question.multi)
    questionTypeMap.set('问答题', Question.text)
}
const canAddOptions = computed(() => questionTypeMap.get(selectedPerson.value.name) === Question.single || questionTypeMap.get(selectedPerson.value.name) === Question.multi)
const isAddQuestionPanelOpen = ref(false)
const questiontitleTmp = ref('新问题')
const questionsTmp: QuestionType[] = reactive([])
function addQuestion() {
    isAddQuestionPanelOpen.value = true
}
const words = ['A', 'B', 'C', 'D']
const optionsTmp: OptionType = reactive([])
const isAddOptionPanelOpen = ref(false)
function addOption() {
    isAddOptionPanelOpen.value = true
    optionsTmp.push({
        order: words[optionsTmp.length],
        text: ''
    })
}
function submitQuestion(){
    questionsTmp.push({
        type: questionTypeMap.get(selectedPerson.value.name),
        title: questiontitleTmp.value,
        option: deepClone(optionsTmp)
    })
    optionsTmp.length = 0
    questiontitleTmp.value = '新问题'
    isAddQuestionPanelOpen.value = false
    selectedPerson.value = {name: '请选择题目类型'}
}

onMounted(()=>{
    addQuestionTypeMapItem()
})

const questionnaireTmp: QuestionnaireType = {
    id: questionnaireStore.getTotal,
    name: '未命名的问卷',
    description: '',
    question: questionsTmp,
    url: '',
    agents: [],
    model: ModelType,
    time: Date.parse(new Date().toString())
}



</script>

<template>
  <div>
    <!-- FAQ -->
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

    <div class="max-w-2xl mx-auto divide-y divide-gray-200 dark:divide-neutral-700">
        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <span class="flex items-center w-[80px] border">问卷名称</span>
                <input v-model="questionnaireTmp.name" type="text" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="问卷名称">
            </div>
        </div>

        <div class="py-8 first:pt-0 last:pb-0">
            <div class="flex gap-x-5">
                <span class="flex items-center w-[80px] border">问卷描述</span>
                <input v-model="questionnaireTmp.description" type="text" id="hs-feedback-post-comment-name-1" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="问卷描述">
            </div>
        </div>

        <div class="flex flex-col py-8 first:pt-0 last:pb-0">
            <render v-for="(item, index) of questionsTmp" :key="index" :question="item"/>
            <div class="flex flex-row justify-center">
            <button 
                type="button" 
                class="w-[100px] my-[10px] py-3 px-4 inline-flex justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                @click='addQuestion'
                >
                添加问题
            </button>
            </div>
        </div>

        <div v-if="isAddQuestionPanelOpen" class="py-8 first:pt-0 last:pb-0">

            <!-- Card -->
            <div class="mt-5 p-4 relative z-10 bg-white border rounded-xl sm:mt-10 md:p-10 dark:bg-neutral-900 dark:border-neutral-700">
                <form>
                    <div class="flex flex-row justify-between mb-4 sm:mb-8">
                        <span>题目类型</span>
                        <Listbox v-model="selectedPerson">
                            <div class="relative mt-[-12px] w-[300px]">
                                <ListboxButton
                                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                                >
                                <span class="block truncate">{{ selectedPerson.name }}</span>
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
                                    v-for="person in people"
                                    :key="person.name"
                                    :value="person"
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
                                        >{{ person.name }}</span
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

                    <div class="flex flex-row justify-between mb-4 sm:mb-8">
                        <span class="mt-[6px]">题干</span>
                        <input v-model="questiontitleTmp" type="text" class="w-[300px] h-[40px] py-3 px-4 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="问卷名称">
                    </div>

                    <div class="flex flex-row mb-4 sm:mb-8">
                        <span>选项</span>
                        <div>
                            <button 
                                v-if="canAddOptions" 
                                type="button"
                                class="w-[100px] h-[30px] justify-center my-[-100px] ml-[232px] py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                @click='addOption'
                                >
                                添加选项
                            </button>
                            <ul v-if="isAddOptionPanelOpen">
                                <li v-for="(item,index) of optionsTmp" :key="index" class="flex flex-row space-x-2 py-2 relative top-[20px] left-[230px]">
                                    <span>{{ item.order }}</span>
                                    <input 
                                        v-model="optionsTmp[index].text" 
                                        :placeholder="item.text" 
                                        class="w-[300px] h-[40px] relative top-[-10px] block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                        />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex flex-row mb-4 sm:mb-8">
                        <button 
                                type="button" 
                                class="w-[100px] h-[30px] justify-center relative top-[10px] left-[230px] text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                @click='submitQuestion'
                                >
                                完成
                            </button>
                    </div>
                </form>
            </div>
            <!-- End Card -->
        </div>


        </div>
    </div>
    <!-- End FAQ -->
 </div>
</template>

<style scope></style>