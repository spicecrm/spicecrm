/**
 * @module ModuleSpiceTimeline
 */

/**
 * the events that belongs to a record which will be displayed in timeline view
 */
export interface EventI {
    /** id of the event */
    id: string;
    /** the event module */
    module: any;
    /** start date of the event */
    start: any;
    /** end date of the event */
    end: any;
    /** the event model data */
    data: any;
    /** the event color to displayed in the timeline view */
    color?: any;
    /** style object will be set for the presentation of the event */
    style: any;
}

/**
 * the input record passed from parent to display its data on the left side of the timeline
 */
export interface RecordI {
    /** id of the record */
    id: string;
    /** name of the record */
    name: string;
    /** events of the record that will be rendered in timeline view */
    events: any;
    /** the date array when a record is unavailable */
    unavailable: Array<{from: any, to: any}>;
}

/**
 * the input record passed from parent to display its data on the left side of the timeline
 */
export interface DurationPartI {
    /** formatted full date of the record */
    fullDate: string;
    /** date formatted text by period unit type */
    text: string;
    /** events of the record that will be rendered in timeline view */
    color: string;
    /** the date array when a record is unavailable */
    hours?: any;
}
