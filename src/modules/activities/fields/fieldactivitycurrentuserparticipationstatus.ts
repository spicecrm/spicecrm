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
    templateUrl: '../templates/fieldactivitycurrentuserparticipationstatus.html'
})
export class fieldActivityCurrentUserParticipationStatus extends fieldGeneric implements OnInit {

    /**
     * holds the participationrecord
     */
    public partcipationRecord: any = undefined

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal,
                public session: session) {

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
    public setParticipation() {
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
