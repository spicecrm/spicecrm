/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

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

    constructor( private backend: backend, private model: model, private language: language ) { }

    public ngOnInit(): void {

        this.backend.postRequest( 'module/QuestionnaireEvaluations/generate/byReference/ServiceFeedbacks/' + this.model.id ).subscribe( ( data: any ) => {
            this.isLoading = false;
            this.source = data.source;
            if ( data.values ) {
                for( let category in data.values ) {
                    this.evaluationValues.push( data.values[category] );
                    this.language.sortObjects( this.evaluationValues, 'name' );
                }
            }
        } );

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

}
