/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { model } from '../../../services/model.service';
import { metadata } from '../../../services/metadata.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';

@Component({
    selector: '[questions-manager-edit-binary-option]',
    templateUrl: '../templates/questionsmanagereditbinaryoption.html',
    providers: [model]
})
export class QuestionsManagerEditBinaryOption implements OnInit, OnChanges {

    @Input() public categorypool;
    @Input() public option: any;
    @Input() public side: string; // l...left, r...right
    @Output() public dataChanged: EventEmitter<any> = new EventEmitter<any>();

    public textIsMultiline = false;

    constructor( public language: language, public metadata: metadata, public model: model, public view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        this.model.module = 'QuestionOptions';
        this.model.id = this.option.id;
        this.model.data = this.option;
        if ( this.option.text?.length < 1 ) this.option.text = this.option.name;
        this.textIsMultiline = this.option.text && ( this.option.text.length > 80 || this.option.text.indexOf("\n") > -1 );
    }

    public ngOnChanges(): void {
        this.model.id = this.option.id;
        this.model.data = this.option;
    }

    public change(): void {
        this.option.name = this.option.text;
        this.option.name = this.option.name.replace( /\s/g, ' ' );
        if ( this.option.name.length > 50 ) this.option.name = this.option.name.substring( 0, 49 )+'…';
        this.dataChanged.emit(true);
    }

}
