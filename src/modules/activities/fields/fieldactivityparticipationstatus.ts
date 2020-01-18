/**
 * @module ModuleActivities
 */
import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    templateUrl: './src/modules/activities/templates/fieldactivityparticipationstatus.html'
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
                public modal: modal) {

        super(model, view, language, metadata, router);

    }

    get participationicon() {
        switch (this.value) {
            case 'accept':
                return 'check';
            case 'decline':
                return 'error';
            case 'tentative':
                return 'question_mark';
            default:
                return 'dash';
        }
    }

}
