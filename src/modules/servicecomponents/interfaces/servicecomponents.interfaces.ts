/**
 * @module ServiceComponentsModule
 */

/**
 * the events that belongs to a record which will be displayed in timeline view
 */
export interface ServicePlannerEventI {
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
}

/**
 * the input record passed from parent to display its data on the left side of the timeline
 */
export interface ServicePlannerRecordI {
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
 * used in the direction service route
 */
export interface ServicePlannerRoutePointI {
    /** longitude of the route point */
    lat?: number;
    /** latitude of the route point */
    lng?: number;
    /** place id of the route point */
    placeId?: string;
}

/**
 * used for the emitted result of  the google direction service
 */
export interface ServicePlannerDirectionResultI {
    /** distance of the trip */
    distance: {
        /** value per meter */
        value: number,
        /** text to be displayed for distance */
        text: string
    };
    /** duration of the trip */
    duration: {
        /** duration per minutes */
        minutes: number,
        /** duration per hours */
        hours: number
    };
}
