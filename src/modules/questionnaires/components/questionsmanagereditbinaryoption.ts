import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import { metadata } from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import { view } from '../../../services/view.service';

@Component({
    selector: '[questions-manager-edit-binary-option]',
    templateUrl: './app/modules/questionnaires/templates/questionsmanagereditbinaryoption.html',
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
        this.data_changed.emit(true);
    }

}