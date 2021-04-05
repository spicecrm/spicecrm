/*
SpiceUI 2021.01.001

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
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

/**
 * renders a table line for one participant
 */
@Component({
    selector: '[activity-participation-panel-participant]',
    templateUrl: './src/modules/activities/templates/activityparticipationpanelparticipant.html',
    providers: [model]
})
export class ActivityParticipationPanelParticipant implements OnInit {

    /**
     * the participant data as object
     */
    @Input() private participant: any = {};

    /**
     * the module for the record
     */
    @Input() private module: string;

    /**
     * if the record is in editmode and the remove btton should be rendered
     */
    @Input() private editmode: boolean = false;

    /**
     * the fieldset to be displayed. This needs to work for users and contacts
     */
    @Input() private fieldset: string;

    /**
     * the fields in the fieldset
     */
    private fieldsetfields: any[] = [];

    /**
     * an event emitter when the item shoudl be removed
     */
    @Output() private remove: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private model: model, @SkipSelf() private parent: model, private metadata: metadata, private view: view) {
    }

    /**
     * initializes the model and loads the fields
     */
    public ngOnInit(): void {
        this.model.module = this.participant.module;
        this.model.id = this.participant.id;
        this.model.data = this.model.utils.backendModel2spice(this.module, this.participant.data);
        this.model.parentmodel = this.parent;

        // get the fields for the fieldset
        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     * handles the click on teh remove button and emits the event
     * @param event
     */
    private removeItem(event) {
        event.stopPropagation();
        if (this.editmode) {
            this.remove.emit(true);
        }
    }

}
