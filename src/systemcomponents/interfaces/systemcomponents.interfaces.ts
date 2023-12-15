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

export type GoogleChartTypeOneDimensional = 'Area' | 'SteppedArea' | 'Bar' | 'Column' | 'Line' | 'Pie' | 'Donut';

export type GoogleChartTypeMultiDimensional = 'Area' | 'SteppedArea' | 'Bar' | 'Column' | 'Line'; // 'Bubble' | 'Sankey' need different structure

export interface SystemSelectNgModelValue {
    id: string;
    name: string;
    group?: string;
}

export interface SystemSelectOptionI {
    id: string;
    name: string;
    group?: string;
    content?: string;
    isGroup?: boolean;
}

export interface GoogleChartOptionsI {
    legend?: GoogleChartOptionLegendI;
    colors?: string[];
    fontSize?: number;
    is3D?: boolean;
    isStacked?: boolean;
}

export interface GoogleChartOptionLegendI {
    position: 'right' | 'left' | 'top' | 'bottom' | 'none',
    alignment?: 'start' | 'center' | 'end'
}

export interface GoogleChartDataRowI {
    c: { v: string | number }[]
}

export interface GoogleChartDataColI {
    id: string;
    label?: string;
    type: string;
    role?: string
}

export interface GoogleChartDataI {
    cols: GoogleChartDataColI[];
    rows: GoogleChartDataRowI[]
}

export interface GoogleChartSelectedObject {
    column: number;
    row: number;
}
