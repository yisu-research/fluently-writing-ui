import { defineComponent, h, ref } from "vue"
import { Question, type QuestionType } from "@/store/modules/questionnaire/helper";

export function useQuestionnaire() {

    const render = defineComponent({
        props:  {
            question:{}
        },
        render() {
            const question: QuestionType = this.question;
            const config = ref({
                divColTag: 'div',
                divColObject: {
                    class: 'flex flex-col justify-between gap-x-5 '
                },
                divRowTag: 'div',
                divRowObject: {
                    class: 'flex flex-row justify-between gap-x-5 '
                },
                labelTag: 'label',
                labelObject: {
                    class: 'w-[80px] my-auto ',
                },
                inputTag: 'input',
                inputObject: {
                    type: question.type,
                    
                },
                spanTag: 'span',
                spanObject: {
                    class: 'px-3',
                },
                btTag: 'SvgIcon',
                btObject: [
                    {
                        class: 'w-6 h-6 shrink-0',
                        icon: 'hugeicons:arrow-up-03',
                        ariahidden: true,
                    },
                    {
                        class: 'w-6 h-6 shrink-0',
                        icon: 'hugeicons:arrow-down-03',
                        ariahidden: true,
                    },
                    {
                        class: 'w-6 h-6 shrink-0',
                        icon: 'hugeicons:edit-02',
                        ariahidden: true,
                    },
                    {
                        class: 'w-6 h-6 shrink-0',
                        icon: 'hugeicons:delete-02',
                        ariahidden: true,
                    }
                ],
            })
            const result = []
            result.push(h(config.value.labelTag, config.value.labelObject, question.title))
            if(question.type === Question.text){
                result.push(h(config.value.inputTag, config.value.inputObject))
            }
            else if(question.type === Question.single || question.type === Question.multi){
                if(question.option){
                    for(let i=0; i<question.option.length; ++i){
                        result.push(h(config.value.divRowTag, config.value.divRowObject, [h(config.value.inputTag, config.value.inputObject), h(config.value.spanTag, config.value.spanObject ,`${question.option[i].order}:${question.option[i].text}`)]))
                    }
                }
            }
            // const bt = []
            // for(let i=0; i<4; ++i) {
            //    bt.push(h(config.value.divTag, config.value.divObject, h(config.value.btTag, config.value.btObject[i])))
            // }
            // result.push(h(config.value.divTag, config.value.divObject, bt))
            return h(config.value.divColTag, config.value.divColObject, result)
        }
    })

    

    return {
        render
    }
}