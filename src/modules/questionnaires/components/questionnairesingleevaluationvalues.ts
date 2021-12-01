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
    templateUrl: '../templates/questionnairesingleevaluationvalues.html',
    styles: [
        "span.quest-eval-points { display: inline-block; text-align: center; min-width: 2rem; margin-left:0.33rem; font-weight: normal; border: 1px solid #fff; }",
        "span.quest-eval-catname { padding-top:0; padding-bottom:0; padding-right:0; font-weight: normal; }"
    ]
})
export class QuestionnaireSingleEvaluationValues implements OnInit {

    public sectionIsOpen = true;
    public isLoading = true;

    public evaluationValues = [];
    public source = '';

    public noParticipation: boolean;

    public route = 'module/QuestionnaireEvaluations/';

    constructor( public backend: backend, public model: model, public language: language, public broadcast: broadcast ) { }

    public ngOnInit(): void {
        // The Service Feedback is in creation just now?
        if ( this.model.isNew ) {
            this.noParticipation = true; // In case there is no Service Feedback yet (in creation just now), then there is also no Questionnaire Participation.
            this.isLoading = false;
            return;
        }

        if ( this.model.module === 'QuestionnaireParticipations') {
            this.route += 'byParticipation/' + this.model.id + '/generate';
        } else {
            this.route += 'byParent/' + this.model.module + '/' + this.model.id + '/generate';
        }
        this.loadValues();
        this.broadcast.message$.subscribe(msg => {
            if ( msg.messagetype == 'questionnaireParticipation.saved' && msg.messagedata.parentType === this.model.module && msg.messagedata.parentId === this.model.id ) {
                this.reloadValues();
            }
        });
    }

    public toggleSection(): void {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    public getSectionStyle(): any {
        if ( !this.sectionIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

    public loadValues(): void {
        this.backend.postRequest( this.route ).subscribe( ( data: any ) => {
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

    public reloadValues(): void {
        this.isLoading = true;
        this.source = '';
        this.evaluationValues.length = 0;
        this.loadValues();
    }

}
