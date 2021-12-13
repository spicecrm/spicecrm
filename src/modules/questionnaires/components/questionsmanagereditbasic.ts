/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Input } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'questions-manager-edit-basic',
    template: ''
})
export class QuestionsManagerEditBasic implements OnInit {

    /**
     * The categories that are available for selection.
     */
    @Input() public categorypool;

    /**
     * A unique ID for the component. Used for the attributes "id" and "for" in html elements.
     */
    public compId = _.uniqueId();

    /**
     * The name field is required. Missing?
     */
    public nameMissing = false;

    /**
     * Parameter object of the question.
     */
    public questionparameters: any;

    constructor( public language: language, public model: model, public view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        if ( !this.model.data.questionparameter || this.model.data.questionparameter.length === 0 ) {
            this.model.data.questionparameter = '{}';
        }
        this.getQuestionparametersFromModel();
    }

    /**
     * Get the question parameters stored as JSON string in the field "questionparameter".
     */
    public getQuestionparametersFromModel(): void {
        this.questionparameters = JSON.parse( this.model.getField('questionparameter'));
    }

    /**
     * Write the question parameters object to the field "questionparameter", stored as JSON string.
     */
    public writeQuestionparametersToModel(): void {
        this.model.setField('questionparameter', JSON.stringify( this.questionparameters ));
    }

    /**
     * Setter for the name of the question.
     * @param val The name of the question.
     */
    public set name( val: string ) {
        this.model.setField('name',val);
    }

    /**
     * Getter for the name of the question.
     */
    public get name(): string {
        return this.model.getField('name');
    }

    /**
     * Setter for the question text of the question.
     * @param val The question text of the question.
     */
    public set questiontext( val: string ) {
        this.model.setField('questiontext', val );
    }

    /**
     * Getter for the question text of the question.
     */
    public get questiontext(): string {
        return this.model.getField('questiontext');
    }

    /**
     * Handler when the question text field lost focus and might got changed.
     */
    public questiontextBlurred(): void {
        if ( !this.name ) {
            this.name = this.questiontext;
            this.nameChanged();
        }
    }

    /**
     * Handler when the name field lost focus and might got changed.
     */
    public nameBlurred(): void {
        if ( !this.name ) {
            this.name = this.questiontext;
            this.nameChanged();
        }
    }

    /**
     * To do, when the name field got changed.
     */
    public nameChanged(): void {
        this.nameMissing = !this.name;
    }

}
