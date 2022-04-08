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
    templateUrl: '../templates/fieldactivityparticipationstatus.html'
})
export class fieldActivityParticipationStatus extends fieldGeneric implements OnInit {

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

    }

    get disabled() {
        if ( this.model.module == 'Users' && this.model.getField('id') == this.session.authData.userId && this.model.parentmodel && this.model.parentmodel.getField('status') == 'Planned') {
            return false;
        }

        return true;
    }

}
