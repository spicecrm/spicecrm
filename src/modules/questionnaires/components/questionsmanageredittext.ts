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
    }

}
