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
                divTag: 'div',
                divObject: {
                    class: 'flex flex-row justify-items-center'
                },
                labelTag: 'label',
                labelObject: {
                    class: '',
                },
                inputTag: 'input',
                inputObject: {
                    type: question.type,
                    class: ''
                },
                spanTag: 'span',
                spanObject: {
                    class: 'px-3',
                },
            })
            const result = []
            result.push(h(config.value.labelTag, config.value.labelObject, question.title))
            if(question.type === Question.text){
                result.push(h(config.value.inputTag, config.value.inputObject))
            }
            else if(question.type === Question.single || question.type === Question.multi){
                if(question.option){
                    for(let i=0; i<question.option.length; ++i){
                        result.push(h(config.value.divTag, config.value.divObject, [h(config.value.inputTag, config.value.inputObject), h(config.value.spanTag, config.value.spanObject ,`${question.option[i].order}:${question.option[i].text}`)]))
                    }
                }
            }
            return result
        }
    })

    return {
        render
    }
}