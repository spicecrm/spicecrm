/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';

@Component({
    selector: 'questions-manager-edit-text',
    templateUrl: './src/modules/questionnaires/templates/questionsmanageredittext.html'
})
export class QuestionsManagerEditText extends QuestionsManagerEditBasic implements OnInit {

    private answer: any = {}; // No array, only one element (a text answer)

    /**
     * Getter for the sequenced flag, stored in the question parameters.
     */
    public get sequenced(): boolean {
        return !!this.questionparameters.sequenced;
    }

    /**
     * Setter for the sequenced flag, stored in the question parameters.
     */
    public set sequenced( value: boolean ) {
        this.questionparameters.sequenced = value;
        this.writeQuestionparametersToModel();
    }

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the property "sequenced", if not yet existing in the question parameter object.
        // "sequenced" is specific for questions of type "text".
        if ( this.questionparameters.sequenced === undefined ) this.sequenced = false;

        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = { beans: {} };
        }
        for ( let i in this.model.data.questionoptions.beans ) {
            this.answer = this.model.data.questionoptions.beans[i];
            break;
        }
        if ( Object.keys( this.answer ).length === 0 ) {
            let newOptionId: string = this.model.generateGuid();
            this.answer = this.model.data.questionoptions.beans[newOptionId] = {
                id: newOptionId,
                question_id: this.model.id,
                name: '',
                categories: '',
                points: ''
            };
        }
    }

}
