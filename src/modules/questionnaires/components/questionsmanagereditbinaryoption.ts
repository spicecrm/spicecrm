/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import { metadata } from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import { view } from '../../../services/view.service';

@Component({
    selector: '[questions-manager-edit-binary-option]',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditbinaryoption.html',
    providers: [model]
})
export class QuestionsManagerEditBinaryOption implements OnInit {

    @Input() categorypool;
    @Input() option: any;
    @Input() side: string; // l...left, r...right
    @Output() data_changed: EventEmitter<any> = new EventEmitter<any>();

    constructor ( private language: language, private metadata: metadata, private model: model, private view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        this.model.module = 'QuestionOptions';
        this.model.id = this.option.id;
        this.model.data = this.option;
    }

    change() {
        this.option.name = this.option.text;
        this.option.name = this.option.name.replace( /\s/g, ' ' );
        if ( this.option.name.length > 50 ) this.option.name = this.option.name.substring( 0, 49 )+'…';
        this.data_changed.emit(true);
    }

}