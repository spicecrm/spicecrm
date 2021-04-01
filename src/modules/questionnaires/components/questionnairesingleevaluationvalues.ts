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
 * @module ModuleQuestionnaires
 */
import {Component, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import { broadcast } from '../../../services/broadcast.service';

@Component({
    selector: 'questionnaire-single-evaluation-values',
    templateUrl: './src/modules/questionnaires/templates/questionnairesingleevaluationvalues.html',
    styles: [
        "span.quest-eval-points { display: inline-block; text-align: center; min-width: 2rem; margin-left:0.33rem; font-weight: normal; border: 1px solid #fff; }",
        "span.quest-eval-catname { padding-top:0; padding-bottom:0; padding-right:0; font-weight: normal; }"
    ]
})
export class QuestionnaireSingleEvaluationValues implements OnInit {

    private sectionIsOpen = true;
    private isLoading = true;

    private evaluationValues = [];
    private source = '';

    private noParticipation: boolean;

    constructor( private backend: backend, private model: model, private language: language, private broadcast: broadcast ) { }

    public ngOnInit(): void {
        // The Service Feedback is in creation just now?
        if ( this.model.isNew ) {
            this.noParticipation = true; // In case there is no Service Feedback yet (in creation just now), then there is also no Questionnaire Participation.
            this.isLoading = false;
            return;
        }
        this.loadValues();
        this.broadcast.message$.subscribe(msg => {
            if ( msg.messagetype == 'questionnaireParticipation.saved' && msg.messagedata.parentType === this.model.module && msg.messagedata.parentId === this.model.id ) {
                this.reloadValues();
            }
        });
    }

    private toggleSection(): void {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    private getSectionStyle(): any {
        if ( !this.sectionIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

    private loadValues(): void {
        this.backend.postRequest( 'module/QuestionnaireEvaluations/generate/byReference/ServiceFeedbacks/' + this.model.id ).subscribe( ( data: any ) => {
                this.isLoading = false;
                this.source = data.source;
                this.noParticipation = ( data.source === 'noParticipation' );
                if ( data.values ) {
                    for( let category in data.values ) {
                        this.evaluationValues.push( data.values[category] );
                        this.language.sortObjects( this.evaluationValues, 'name' );
                    }
                }
            },
            error => {
                if( error.status === 404 ) {
                    this.noParticipation = true; // In case there is no Service Feedback yet, then there is also no Questionnaire Participation.
                    this.isLoading = false;
                }
            });
    }

    private reloadValues(): void {
        this.isLoading = true;
        this.source = '';
        this.evaluationValues.length = 0;
        this.loadValues();
    }

}
