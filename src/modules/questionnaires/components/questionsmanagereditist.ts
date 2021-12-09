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
    selector: 'questions-manager-edit-ist',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditist.html'
})
export class QuestionsManagerEditIst extends QuestionsManagerEditBasicWithOptions implements OnInit {

    constructor( public language: language, public model: model, public view: view, public metadata: metadata ) {
        super( language, model, view, metadata );
    }

    public ngOnInit(): void {
        super.ngOnInit();
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
            this.model.data.questionoptions = { beans: {} };
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i in keys ) this.options[i] = this.model.data.questionoptions.beans[keys[i]];
    }

}
