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
    selector: 'questions-manager-edit-multi',
    templateUrl: '../templates/questionsmanagereditmulti.html'
})
export class QuestionsManagerEditMulti extends QuestionsManagerEditBasicWithOptions implements OnInit {

    constructor( public language: language, public model: model, public view: view, public metadata: metadata ) {
        super( language, model, view, metadata );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the properties "minAnswers", "maxAnswers" and "hasInfosCorrectness", if not yet existing in the question parameter object.
        // "minAnswers", "minAnswers" and "hasInfosCorrectness" are specific for questions of type "multi".
        if ( typeof this.questionparameters.minAnswers === 'undefined' ) {
            this.questionparameters.minAnswers = '';
            this.writeQuestionparametersToModel();
        }
        if ( typeof this.questionparameters.maxAnswers === 'undefined' ) {
            this.questionparameters.maxAnswers = '';
            this.writeQuestionparametersToModel();
        }
        if ( typeof this.questionparameters.hasInfosCorrectness === 'undefined' ) {
            this.questionparameters.hasInfosCorrectness = false;
            this.writeQuestionparametersToModel();
        }
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet (options are not built yet)
        });
    }

    /**
     * Build the list of options, after the question model (with question options) has been loaded.
     */
    public buildEntries(): void {
        this.isBuilt = true;
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = { beans:{} };
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i in keys ) this.options[i] = this.model.data.questionoptions.beans[keys[i]];
    }


    get minAnswers(){
        return this.questionparameters.minAnswers;
    }

    set minAnswers(value){
        this.questionparameters.minAnswers = value;
        this.writeQuestionparametersToModel();
    }

    get maxAnswers(){
        return this.questionparameters.maxAnswers;
    }

    set maxAnswers(value){
        this.questionparameters.maxAnswers = value;
        this.writeQuestionparametersToModel();
    }

    get hasInfosCorrectness(){
        return this.questionparameters.hasInfosCorrectness;
    }

    set hasInfosCorrectness(value){
        this.questionparameters.hasInfosCorrectness = value;
        this.writeQuestionparametersToModel();
    }

    /**
     * Done before saving:
     * In case the correctness of options is not defined, set all to false.
     */
    public doBeforeSavingQuestion(): void {
        if ( !this.questionparameters.hasInfosCorrectness ) {
            this.options.some( option => {
                option.is_correct_option = false;
                return false;
            } );
        }
    }

}
