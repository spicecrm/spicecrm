
/**
 * used in the direction service route
 */
export interface RoutePointI {
    lat?: number;
    lng?: number;
    placeId?: string;
}

/**
 * used to specify the google map display options
 */
export interface mapOptionsI {
    /** show/hide current position by browser */
    showMyLocation?: boolean;
    /** activate/deactivate grouping markers by cluster service on a narrow distance between markers */
    showCluster?: boolean;
    /** activate/deactivate model popover for the marker on click event */
    markerWithModelPopover?: boolean;
    /** when the center is set, a circle will be drawn on the map centered by the input latitude and longitude */
    center?: { lng: number, lat: number };
    /** set the travel model for the direction service */
    directionTravelMode?: 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING';
    /** radius of the drawn circle */
    radius?: number;
}

/**
 * used for google maps marker data
 */
export interface RecordI {
    /** necessary for the popover component */
    id: string;
    /** will be shown on hover on the marker */
    title: string;
    /** necessary for the popover component */
    module: string;
    /** latitude position of the record */
    lat: number;
    /** longitude position of the record */
    lng: number;
    /** color of the records marker */
    color?: string;
}

/**
 * used for the emitted result of  the google direction service
 */
export interface DirectionResultI {
    distance: number;
    duration: {
        minutes: number,
        hours: number
    };
}
