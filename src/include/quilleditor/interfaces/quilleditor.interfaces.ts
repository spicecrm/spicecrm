/**
 * @module QuillEditorModule
 */

export type QuillToolbarConfigT = Array<Array<string | {
    indent?: string
    list?: string
    direction?: string
    header?: number | Array<boolean | number>
    color?: string[] | string
    background?: string[] | string
    align?: string[] | string
    script?: string
    font?: string[] | string
    size?: Array<boolean | string>
}>>;

export interface QuillModulesI {
    clipboard?: {
        matchers?: any[]
        matchVisual?: boolean
    } | boolean;
    history?: {
        delay?: number
        maxStack?: number
        userOnly?: boolean
    } | boolean;
    keyboard?: {
        bindings?: any
    } | boolean;
    syntax?: boolean;
    toolbar?: QuillToolbarConfigT | string | {
        container?: string | string[] | QuillToolbarConfigT
        handlers?: {
            [key: string]: any
        }
    } | boolean;

    [key: string]: any;
}
