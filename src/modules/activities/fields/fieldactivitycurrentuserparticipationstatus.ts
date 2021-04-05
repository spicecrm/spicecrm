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
import {Component, ElementRef, Renderer2, OnInit, SkipSelf} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {session} from '../../../services/session.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

/**
 * renders a status field for the participation status
 */
@Component({
    templateUrl: './src/modules/activities/templates/fieldactivitycurrentuserparticipationstatus.html'
})
export class fieldActivityCurrentUserParticipationStatus extends fieldGeneric implements OnInit {

    /**
     * holds the participationrecord
     */
    private partcipationRecord: any = undefined

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal,
                private session: session) {

        super(model, view, language, metadata, router);

        // subscribe to model $data and build the participants .. replacing the setter
        this.subscriptions.add(this.model.data$.subscribe(modelData => {
            this.setParticipation();
        }));

    }

    get disabled() {
        if (this.partcipationRecord && !this.isEditMode() && this.model.getField('status') == 'Planned') {
            return false;
        }
        return true;
    }

    /**
     * simple getter for the value
     */
    get value() {
        return this.partcipationRecord ? this.partcipationRecord.activity_accept_status : 'none';
    }

    /**
     * setter for the value
     *
     * @param newValue
     */
    set value(newValue) {
        this.partcipationRecord.activity_accept_status = newValue;
    }

    /**
     * determines and sets the participation
     */
    private setParticipation() {
        this.partcipationRecord = undefined;

        // do not set if the current user is the assgined user
        if (this.model.getField('assigned_user_id') == this.session.authData.userId) return;

        // check if we find the current user in teh users list
        if (this.model.data.users) {
            for (let beanid in this.model.data.users.beans) {
                if (this.model.data.users.beans[beanid].id == this.session.authData.userId) {
                    this.partcipationRecord = this.model.data.users.beans[beanid];
                }
            }
        }
    }

}
