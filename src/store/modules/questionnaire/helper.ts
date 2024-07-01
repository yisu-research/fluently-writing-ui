export interface QuestionnaireState {
    currentID: number | null
    total: number
    questionnaire: QuestionnaireType[]
}

// 问卷类型
export interface QuestionnaireType {
    id: number 
    name: string
    description: string | null
    question: QuestionType[]
    url: string | null
    agents: AgentType[]
    model: ModelType
    time: string
}

// 问卷类型-问题类型
export interface QuestionType {
    type: Question
    title: string
    option: OptionType[] | null
}
export enum Question {
    single = 'radio',
    multi = 'checkbox',
    text = 'text',
}

// 问卷类型-问卷类型-选项类型
export interface OptionType {
    order: string
    text: string
}

// 代理类型
export interface AgentType {
    name: string | undefined
    number: number | undefined
    requirement: RequirementType[] | undefined
}

// 代理类型-组别条件类型
export interface RequirementType {
    title: string | undefined
    description: string | undefined
    selectedRequirement: string | undefined
}

// 问卷类型-模型
export enum ModelType {
    gpt3_5 = 'gpt-3.5-turbo',
    gpt4o = 'gpt-4o',
}

export function defaultState(): QuestionnaireState {
    return {
        currentID: null,
        total: 0,
        questionnaire: []
    }
}