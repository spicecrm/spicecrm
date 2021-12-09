/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasicWithOptions } from './questionsmanagereditbasicwithoptions';
import { metadata } from '../../../services/metadata.service';

@Component({
    selector: 'questions-manager-edit-single',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditsingle.html',
})
export class QuestionsManagerEditSingle extends QuestionsManagerEditBasicWithOptions implements OnInit {

    constructor( public language: language, public model: model, public view: view, public metadata: metadata ) {
        super( language, model, view, metadata );
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the property "formatOptionsHorizontal", if not yet existing in the question parameter object.
        // "formatOptionsHorizontal" is specific for questions of type "single".
        if ( typeof this.questionparameters.formatOptionsHorizontal === 'undefined' ) {
            this.questionparameters.formatOptionsHorizontal = false;
            this.writeQuestionparametersToModel();
        }
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet
        });
    }

    /**
     * Build the list of options, after the question model (with question options) has been loaded.
     */
    public buildEntries(): void {

        this.isBuilt = true;

        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = {beans: {}};
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( ( a,b ) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i in keys ) this.options[i] = this.model.data.questionoptions.beans[keys[i]];
    }

    /**
     * Handler if the flag "formatOptionsHorizontal" got changed.
     * @param event Event
     */
    public onChange_formatOptionsHorizontal( event ): void {
        this.questionparameters.formatOptionsHorizontal = event.target.checked;
        this.writeQuestionparametersToModel();
    }

}
