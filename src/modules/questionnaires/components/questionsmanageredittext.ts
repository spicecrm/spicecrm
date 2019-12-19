/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input } from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'questions-manager-edit-text',
    templateUrl: './src/modules/questionnaires/templates/questionsmanageredittext.html'
})
export class QuestionsManagerEditText implements OnInit {

    @Input() public questionset: any = {};
    @Input() public categorypool;

    private answer: any = {}; // No array, only one element (a text answer)
    private sequenced = false;
    private isBuilt = false;

    constructor( private language: language, private metadata: metadata, private model: model, private view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet
        });
    }

    private buildEntries(): void {

        this.isBuilt = true;

        if ( this.questionset.data.questiontypeparameter.length ) {
            let config = JSON.parse( this.questionset.data.questiontypeparameter );
            if ( config.text && config.text.sequenced ) this.sequenced = config.text.sequenced;
        }

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
