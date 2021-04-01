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
 * @module Questionnaires
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';
import {Router} from '@angular/router';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'field-questionnaire',
    templateUrl: './src/modules/questionnaires/templates/fieldquestionnaire.html'
})
export class fieldQuestionnaire extends fieldGeneric implements OnInit, OnDestroy {

    private questionnaireParticipation: questionnaireParticipationService;
    private questionnaireId = '';

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.subscribeToModelDataChange();
        this.subscribeToModelEditCancel();
    }

    /**
     * Subscribe to data changes to reset the formatted value
     */
    private subscribeToModelDataChange(): void {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                let dummy = this.model.getField('questionnaire_id');
                if ( dummy ) {
                    if( dummy !== this.questionnaireId ) {
                        this.questionnaireId = dummy;
                    }
                } else {
                    if ( this.questionnaireId ) this.questionnaireId = dummy;
                }
            })
        );
    }

    /**
     * Subscribe to changes of model edit status.
     */
    private subscribeToModelEditCancel(): void {
        this.subscriptions.add(
            this.model.canceledit$.subscribe( () => {
                this.questionnaireParticipation.reset();
            } )
        );
    }

    /**
     * Un-subscriptions when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Is called by the questionaire partition service every modification of answer data.
     * Keeps the model field up to date with the current answer data.
     */
    private answersChanged(): void {
        let answers = _.clone( this.questionnaireParticipation.getData());
        let data = { answers: answers, questionnaireId: this.model.getField('questionnaire_id') };
        this.value = data;
    }

}
