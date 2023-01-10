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

export interface SystemTreeItemI {
    id: string;
    name: string;
    parent_id?: string;
    parent_sequence?: string;
    clickable?: boolean;
    icon?: string;
    systemTreeDefs?: {
        icon?: string,
        expanded?: boolean,
        clickable?: boolean,
        level?: number,
        isSelected?: boolean,
        hasChildren?: boolean,
    };
}

export interface SystemTreeConfigI {
    draggable?: boolean;
    canadd?: boolean;
    expandall?: boolean;
    collapsible?: boolean;
}