/**
 * used for input radio group input
 */
export interface InputRadioOptionI {
    /** to be emitted when the input is checked */
    value: string;
    /** display label */
    label?: string;
    /** for dom unique id */
    id?: string;
    /** for dom unique name */
    name?: string;
    /** display icon */
    icon?: string;
    /** used for title attribute */
    title?: string;
    /** disabled value for the input */
    disabled?: boolean;
}
