/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpiceMap
 */

/**
 * used in the direction service route
 */
export interface RoutePointI {
    /** longitude of the route point */
    lat?: number;
    /** latitude of the route point */
    lng?: number;
    /** place id of the route point */
    placeId?: string;
}

/**
 * used for the map circle center
 */
export interface MapCenterI {
    /** longitude of the center */
    lng: number;
    /** latitude of the center */
    lat: number;
    /** address of the center */
    address?: string;
}

/**
 * used for building the map fixed circle
 */
export interface MapFixedCircleI {
    /** the center of the circle */
    center: MapCenterI;
    /** radius of the circle */
    radius: number;
    /** define the circle color */
    color?: string;
}

/**
 * used for building the map circle
 */
export interface MapCircleI extends MapFixedCircleI {
    /** enable dragging the circle center on the map */
    draggable?: boolean;
    /** enable resizing the circle on the map */
    editable?: boolean;
    /** percentage of the circle radius to the map */
    radiusPercentage?: number;
}

/**
 * used to specify the google map display options
 */
export interface MapOptionsI {
    /** show/hide current position by browser */
    showMyLocation?: boolean;
    /** activate/deactivate grouping markers by cluster service on a narrow distance between markers */
    showCluster?: boolean;
    /** activate/deactivate model popover for the marker on click event */
    markerWithModelPopover?: boolean;
    /** defines the modal component to be rendered as marker popover */
    popoverComponent?: string;
    /** when the center is set, a circle will be drawn on the map centered by the input latitude and longitude */
    circle?: MapCircleI;
    /** when the center is set, a circle will be drawn on the map centered by the input latitude and longitude */
    fixedCircle?: MapCircleI;
    /** set the travel model for the direction service */
    directionTravelMode?: 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING';
    /** a distance unit of measure to be returned by the navigation service result */
    unitSystem?: 'METRIC'|'IMPERIAL';
    /** a color set for the focused item marker */
    focusColor?: string;
    /** necessary to rerender the circle if true */
    changed?: {
        showMyLocation?: boolean
        showCluster?: boolean,
        markerWithModelPopover?: boolean,
        fixedCircle?: boolean,
        circle?: boolean,
        circleRadius?: boolean,
        circleEditable?: boolean,
        circleCenter?: boolean,
        directionTravelMode?: boolean,
        unitSystem?: boolean,
        focusColor?: boolean
    };
}

/**
 * used for the spice google maps record component config and extends the mapOptions
 */
export interface RecordComponentConfigI {
    /** show/hide current position by browser */
    showMyLocation?: boolean;
    /** activate/deactivate grouping markers by cluster service on a narrow distance between markers */
    showCluster?: boolean;
    /** activate/deactivate model popover for the marker on click event */
    markerWithModelPopover?: boolean;
    /** defines the modal component to be rendered as marker popover */
    popoverComponent?: string;
    /** set the travel model for the direction service */
    directionTravelMode?: 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING';
    /** to save the height of the map */
    mapHeight?: number;
    /** for the data table fields */
    fieldset?: string;
    /** percentage of the circle radius to the map */
    radiusPercentage?: number;
    /** hex color for the map circle */
    circleColor?: string;
    /** hex color for the model list filter map circle */
    filterCircleColor?: string;
    /** hex color for the focused item marker */
    focusColor?: string;
    /** a distance unit of measure to be returned by the navigation service result */
    unitSystem?: 'METRIC'|'IMPERIAL';
    /** show/hide list header */
    showListHeader?: boolean;
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
