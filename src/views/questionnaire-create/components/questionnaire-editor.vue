<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { useMessage } from 'naive-ui';
import { useQuestionnaire } from '../hooks/useQuestionnaire'
import { type OptionType, Question, type QuestionType, type QuestionnaireType } from '@/store/modules/questionnaire/helper'
import { deepClone } from '@/utils/deepClone'
import { SvgIcon } from '@/components/common'



const props = defineProps<{
    questionnaireTmp: QuestionnaireType,
    step: number
}>()
const emit = defineEmits(['update:questionnaireTmp','update:step'])
const { questionnaireTmp } = toRefs(props)
const { render } = useQuestionnaire()
const message = useMessage()


const questionsTmp: QuestionType[] = questionnaireTmp.value.question
const questiontitleTmp = ref('新问题')
const isAddQuestionPanelOpen = ref(false)

const people = [
    { name: '单选题' },
    { name: '多选题' },
    { name: '问答题' },
]
const selectedPerson = ref({name: '请选择题目类型'})
const questionTypeMap = new Map<string, Question>()

const optionsTmp: OptionType[] = reactive([])
const canAddOptions = computed(() => questionTypeMap.get(selectedPerson.value.name) === Question.single || questionTypeMap.get(selectedPerson.value.name) === Question.multi)
const words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
const isAddOptionPanelOpen = ref(false)

function addQuestionTypeMapItem() {
    questionTypeMap.set('单选题', Question.single)
    questionTypeMap.set('多选题', Question.multi)
    questionTypeMap.set('问答题', Question.text)
}

function addQuestion() {
    isAddQuestionPanelOpen.value = true
}
function closeDialog() {
    isAddQuestionPanelOpen.value = false
}

function addOption() {
    const count = optionsTmp.length
    if(count >= words.length){
        message.warning("选项数目已达上限！")
        return 
    }
    isAddOptionPanelOpen.value = true
    optionsTmp.push({
        order: words[optionsTmp.length],
        text: ''
    })
}
function deleteOption(index: number) {
    optionsTmp.splice(index,1)
    for(let i=0; i<optionsTmp.length; ++i){
        optionsTmp[i].order = words[i]
    }
}

function submitQuestion(){
    const typeTmp = questionTypeMap.get(selectedPerson.value.name)
    if(!typeTmp) {
        message.warning("请选择题目类型！")
        return 
    }
    if(!questiontitleTmp.value || questiontitleTmp.value === ''){
        message.warning("请输入题干！")
        return 
    }
    const optionsTmpClone = deepClone(optionsTmp)
    if(typeTmp === Question.single || typeTmp === Question.multi) {
        if(optionsTmpClone.length === 0) {
            message.warning("请为题目添加选项！")
            return 
        }
        for(let i=0; i<optionsTmpClone.length; ++i){
            if(!optionsTmpClone[i].text || optionsTmpClone[i].text === ''){
                message.warning("请为所有选项添加内容！")
                return 
            }
        }
    }
    questionsTmp.push({
        type: typeTmp,
        title: questiontitleTmp.value,
        option: optionsTmpClone,
    })
    optionsTmp.length = 0
    questiontitleTmp.value = '新问题'
    isAddQuestionPanelOpen.value = false
    selectedPerson.value = {name: '请选择题目类型'}
}
 
function submitQuestionnaire() {
    const qs = deepClone(questionsTmp)
    if(!qs || qs.length === 0){
        message.warning("请为问卷添加问题！")
        return 
    }
    questionnaireTmp.value.question = qs
    questionnaireTmp.value.url = ''
    questionnaireTmp.value.time = new Date().toString()
    emit('update:questionnaireTmp',questionnaireTmp)
}
function previewQuestionnaire() {

}
function finishEditorQuestionnaire() {
    if(questionsTmp.length === 0) {
        message.warning("请先完成问卷编辑！")
        return 
    }
    submitQuestionnaire()
    emit('update:step',1)
}

onMounted(()=>{
    addQuestionTypeMapItem()
})

function upQuestion() {

}





</script>

<template>
  <div>
    <!-- FAQ -->
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

        <div class="max-w-2xl mx-auto ">
            <div class="py-8 first:pt-0 last:pb-0">
                <div class="flex gap-x-5">
                    <label class="flex items-center w-[80px] border">问卷名称</label>
                    <input v-model="questionnaireTmp.name" type="text" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="问卷名称">
                </div>
            </div>

            <div class="py-8 first:pt-0 last:pb-0">
                <div class="flex gap-x-5">
                    <label class="flex items-center w-[80px] border">问卷描述</label>
                    <input v-model="questionnaireTmp.description" id="hs-feedback-post-comment-name-1" type="text" class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="问卷描述">
                </div>
            </div>

            <div class="flex flex-col py-8 first:pt-0 last:pb-0">
                <div v-for="(item, index) of questionsTmp" class="flex flex-row justify-between" :key="index">
                    <render :question="item"/>
                    <div v-if="questionsTmp.length>0" class="flex flex-row justify-between space-x-1 my-auto">
                        <div class="cursor-pointer" @click="upQuestion">
                            <SvgIcon icon="hugeicons:arrow-up-03" class="w-6 h-6 shrink-0" aria-hidden="true" />
                        </div>
                        <div class="cursor-pointer" @click="upQuestion">
                            <SvgIcon icon="hugeicons:arrow-down-03" class="w-6 h-6 shrink-0" aria-hidden="true" />
                        </div>
                        <div class="cursor-pointer" @click="upQuestion">
                            <SvgIcon icon="hugeicons:edit-02" class="w-6 h-6 shrink-0" aria-hidden="true" />
                        </div>
                        <div class="cursor-pointer" @click="upQuestion">
                            <SvgIcon icon="hugeicons:delete-02" class="w-6 h-6 shrink-0" aria-hidden="true" />
                        </div>
                    </div>  
                </div>
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

            <div>
                <TransitionRoot appear :show="isAddQuestionPanelOpen" as="template">
                    <Dialog as="div" class="relative z-10" @close="closeDialog">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-black/25" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div
                        class="flex min-h-full items-center justify-center p-4 text-center"
                        >
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                            class="w-full max-w-[800px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                            >
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
                                                    v-for="person in people"
                                                    v-slot="{ active, selected }"
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

                                    <div class="flex flex-col">
                                        <div class="flex flex-row justify-start space-x-[340px] mt-[-10px]">
                                            <span v-if="canAddOptions" class="my-auto">选项</span>
                                            <button 
                                                v-if="canAddOptions" 
                                                type="button"
                                                class="w-[100px] h-[30px] justify-center inline-flex items-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                @click='addOption'
                                                >
                                                添加选项
                                            </button>
                                        </div>

                                        <div>
                                            <ul v-if="isAddOptionPanelOpen" class="mt-4">
                                                <li v-for="(item,index) of optionsTmp" :key="index" class="flex flex-row space-x-2 py-2 ml-[370px] mt-2">
                                                    <span class="my-auto">{{ item.order }}</span>
                                                    <input 
                                                        v-model="optionsTmp[index].text" 
                                                        :placeholder="item.text" 
                                                        class="w-[260px] h-[40px] ml-[100px] block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                                        />
                                                    <div class="cursor-pointer" @click="deleteOption(index)">
                                                        <SvgIcon icon="hugeicons:delete-04" class="w-6 h-6 shrink-0" aria-hidden="true" />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="flex flex-row mb-4 sm:mb-8 justify-center">
                                        <button 
                                                type="button" 
                                                class="w-[100px] h-[30px]  text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                @click='submitQuestion'
                                                >
                                                下一步
                                            </button>
                                    </div>
                                </form>
                            </div>
                            <!-- End Card -->

                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
                </Dialog>
            </TransitionRoot>
            </div>

            <div>
                <div class="flex flex-row justify-between w-full mt-2">
                    <button 
                        type="button" 
                        class="w-[100px] h-[30px] justify-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='submitQuestionnaire'
                        >
                        保存
                    </button>
                    <button 
                        type="button" 
                        class="w-[100px] h-[30px] justify-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='previewQuestionnaire'
                        >
                        预览
                    </button>
                    <button 
                        type="button" 
                        class="w-[100px] h-[30px] justify-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        @click='finishEditorQuestionnaire'
                        >
                        完成
                    </button>
                </div>
            </div>

        </div>
    </div>
    <!-- End FAQ -->
 </div>
</template>

<style scope></style>

