/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-questionnaire-evaluation',
    templateUrl: '../templates/fieldquestionnaireevaluation.html'
})
export class fieldQuestionnaireEvaluation extends fieldGeneric {

    public categories: any[] = [];
    public isEvaluationAvailable = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public backend: backend ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();

        let dummy = this.model.getRelatedRecords('questionnaireevaluation');
        if ( dummy && dummy[0] ) {
            if ( dummy[0].questionnaireevaluationitems && dummy[0].questionnaireevaluationitems.beans ) {
                let evaluation = dummy[0].questionnaireevaluationitems.beans;
                for ( let id in dummy[0].questionnaireevaluationitems.beans ) {
                    this.categories.push( dummy[0].questionnaireevaluationitems.beans[id] );
                }
                this.isEvaluationAvailable = true;
            }
        }

    }

}
