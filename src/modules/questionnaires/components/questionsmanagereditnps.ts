/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import { stringify } from 'querystring';

@Component({
    selector: 'questions-manager-edit-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditnps.html'
})
export class QuestionsManagerEditNPS implements OnInit {

    @Input() public questionset: any = {};
    @Input() public categorypool;

    private forCategories = { categories: '' };

    constructor( private language: language, private metadata: metadata, private model: model, private view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        if (this.model.isLoading) {
            this.model.data$.subscribe(() => this.readCategories() );
        } else this.readCategories();
    }

    private readCategories(): void {
        let params;
        try {
            params = JSON.parse( this.model.data.questionparameter );
        } catch (e) {
            params = {};
        }
        this.forCategories.categories = params.categories ? params.categories : '';
    }

    private writeCategories(): void {
        let params;
        try {
            params = JSON.parse( this.model.data.questionparameter );
        } catch (e) {
            params = {};
        }
        params.categories = this.forCategories.categories;
        this.model.data.questionparameter = JSON.stringify( params );
    }

    private change(): void { null; }

}
