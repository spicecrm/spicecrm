/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Input } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasicWithOptions } from './questionsmanagereditbasicwithoptions';

declare var _: any;

@Component({
    selector: 'questions-manager-edit-binary',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditbinary.html',
    styles: [ 'tr.no-hover:hover td { background-color: inherit; box-shadow: none !important; }']
})
export class QuestionsManagerEditBinary extends QuestionsManagerEditBasicWithOptions implements OnInit {

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
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
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans) {
            this.model.data.questionoptions = {beans: {}};
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i=0; i<2; i++ ) {
            if ( !keys[i] || !this.model.data.questionoptions.beans[keys[i]] ) {
                let newOptionId: string = this.model.generateGuid();
                if ( !keys[i] ) keys.push(newOptionId);
                this.model.data.questionoptions.beans[newOptionId] = {
                    id: newOptionId,
                    question_id: this.model.id,
                    name: '',
                    categories: '',
                    points: '',
                    position: i
                };
            }
            this.options[i] = this.model.data.questionoptions.beans[keys[i]];
        }
    }

    /**
     * Exchange the two options (swap).
     */
    public exchangeOptions(): void {
        let tmp = this.options[0];
        this.options[0] = this.options[1];
        this.options[1] = tmp;
        this.options[0].position = 0;
        this.options[1].position = 1;
        this.generateName();
    }

    /**
     * Handler in case the options got changed.
     * @param event Event
     */
    public handleChange( event ): void {
        if ( event === true ) this.generateName();
    }

    /**
     * Generate the question name in case it is not specified yet. Generate it from the two option names.
     */
    public generateName(): void {
        if ( !this.name && this.options[0].name && this.options[1].name ) {
            this.name = this.options[0].name + ' / ' + this.options[1].name;
        }
    }

}
