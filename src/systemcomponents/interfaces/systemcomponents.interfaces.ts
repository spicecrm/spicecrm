/**
 * @module SystemComponents
 */

/**
 * used for input radio group input
 */
export interface InputRadioOptionI {
    /** to be emitted when the input is checked */
    value: string;
    /** display label */
    label?: string;
    /** for dom unique id (will be set in the group) */
    id?: string;
    /** display icon instead of text */
    icon?: string;
    /** used for title attribute (will be defined from label if it is undefined) */
    title?: string;
    /** disabled value for the input */
    disabled?: boolean;
}
