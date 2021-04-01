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
