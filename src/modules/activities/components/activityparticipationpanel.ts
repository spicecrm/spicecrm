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
 * @module ModuleActivities
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

declare var moment: any;
declare var _: any;

/**
 * renders a panel with the particopating users and contacts in the activity
 */
@Component({
    selector: 'activity-participation-panel',
    templateUrl: './src/modules/activities/templates/activityparticipationpanel.html',
    providers: [view]
})
export class ActivityParticipationPanel{

    /**
     * the partcipants as input gtom the field since this is rendered as part of a field
     */
    @Input() private participants: any[] = [];

    /**
     * indicates if we are editing or not. This trigers if the remove button is visible
     */
    @Input() private editmode: boolean = false;

    /**
     * the fieldset to render in the table
     */
    @Input() private fieldset: string;

    /**
     * an event emitter if an item is removed from the array. The field this is embedded in shoudl handle the removal from the relationship
     */
    @Output() private remove: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private metadata: metadata, private view: view, private language: language) {
        this.view.isEditable = false;
        this.view.displayLabels = false;
    }

    /**
     * recieves the event and emits it
     *
     * @param participant
     */
    private removeParticipant(participant) {
        this.remove.emit(participant);
    }

    /**
     * trackby function for the participant to imporve rendering and performance
     *
     * @param participant
     * @param index
     */
    private participantid(index, participant) {
        return participant.id;
    }

}
