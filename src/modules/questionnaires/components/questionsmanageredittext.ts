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
    templateUrl: '../templates/questionsmanageredittext.html'
})
export class QuestionsManagerEditText extends QuestionsManagerEditBasic implements OnInit {

    public answer: any = {}; // No array, only one element (a text answer)

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

    /**
     * Getter for the sequenced flag, stored in the question parameters.
     */
    public get isInput(): boolean {
        return !!this.questionparameters.isinput;
    }

    /**
     * Setter for the sequenced flag, stored in the question parameters.
     */
    public set isInput( value: boolean ) {
        this.questionparameters.isinput = value;
        this.writeQuestionparametersToModel();
    }

    /**
     * Getter for the numeric flag (answer has to be numeric), stored in the question parameters.
     */
    public get numeric(): boolean {
        return !!this.questionparameters.numeric;
    }

    /**
     * Setter for the numeric flag (answer has to be numeric), stored in the question parameters.
     */
    public set numeric( value: boolean ) {
        this.questionparameters.numeric = value;
        this.writeQuestionparametersToModel();
    }

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the properties "sequenced" and "numeric", if not yet existing in the question parameter object.
        // "sequenced" and "numeric" are specific for questions of type "text".
        if ( this.questionparameters.sequenced === undefined ) this.sequenced = false;
        if ( this.questionparameters.numeric === undefined ) this.numeric = false;

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
