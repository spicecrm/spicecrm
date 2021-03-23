/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';

@Component({
    selector: 'questions-manager-edit-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditnps.html'
})
export class QuestionsManagerEditNPS extends QuestionsManagerEditBasic implements OnInit {

    // The object "forCategories" is a workaround,
    // because the component QuestionsManagerEditCategories wants a object/bean of module QuestionOptions (with field "categories").
    private forCategories = { categories: '' };

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the properties "textForScore0" and "textForScore10", if not yet existing in the question parameter object.
        // "textForScore0" and "textForScore10" are specific for questions of type "nps".
        if ( typeof this.questionparameters.textForScore0 === 'undefined' ) {
            this.questionparameters.textForScore0 = '';
            this.writeQuestionparametersToModel();
        }
        if ( typeof this.questionparameters.textForScore10 === 'undefined' ) {
            this.questionparameters.textForScore10 = '';
            this.writeQuestionparametersToModel();
        }
    }

    /**
     * Setter for "textForScore0", a property of the question parameters.
     * @param val The text for rating 0.
     */
    public set textForScore0( val: string ) {
        this.questionparameters.textForScore0 = val;
        this.writeQuestionparametersToModel();
    }

    /**
     * Getter for "textForScore0", a property of the question parameters.
     */
    public get textForScore0(): string {
        return this.questionparameters.textForScore0;
    }

    /**
     * Setter for "textForScore10", a property of the question parameters.
     * @param val The text for rating 10.
     */
    public set textForScore10( val: string ) {
        this.questionparameters.textForScore10 = val;
        this.writeQuestionparametersToModel();
    }

    /**
     * Getter for "textForScore10", a property of the question parameters.
     */
    public get textForScore10(): string {
        return this.questionparameters.textForScore10;
    }

    /**
     * Handler when the selection of categories has got changed.
     */
    public categoriesChanged(): void {
        this.questionparameters.categories = this.forCategories.categories;
        this.writeQuestionparametersToModel();
    }

    /**
     * Get the question parameters stored as JSON string in the field "questionparameter".
     * Taking care also for the selection of categories.
     */
    public getQuestionparametersFromModel(): void {
        super.getQuestionparametersFromModel();
        this.forCategories.categories = this.questionparameters.categories;
    }

    /**
     * Write the question parameters object to the field "questionparameter", stored as JSON string.
     * Taking care also for the selection of categories.
     */
    public writeQuestionparametersToModel(): void {
        this.questionparameters.categories = this.forCategories.categories;
        super.writeQuestionparametersToModel();
    }

}
