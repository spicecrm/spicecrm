/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: '[questions-manager-edit-option-single-multi]',
    templateUrl: '../templates/questionsmanagereditoptionsinglemulti.html',
    providers: [model,view]
})
export class QuestionsManagerEditOptionSingleMulti implements OnInit {

    @Input() public categorypool;
    @Output() public event: EventEmitter<any> = new EventEmitter<any>();
    @Input() public option: any;
    @Input() public isFirstRow: boolean;
    @Input() public isLastRow: boolean;
    @Input() public hasInfosCorrectness: boolean;
    @Output() public isDirty: boolean;

    public textIsMultiline = false;

    constructor( public language: language, public metadata: metadata, public model: model, public view: view, public modalservice: modal ) {
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

    public deleteOption(): void {
        this.modalservice.confirm( this.language.getLabelFormatted('QST_DELETE_ANSWER_OPTION_LONG', this.option.name ),
            this.language.getLabel('QST_DELETE_ANSWER_OPTION')).subscribe( answer => {
            if ( answer ) this.event.emit( 'delete');
        });
    }

    /**
     * Handler if the checkbox "is_correct_option" got changed.
     * @param event Event
     */
    public onChange_isCorrectOption( event ): void {
        this.option.is_correct_option = event.target.checked;
    }

    public optionUp(): void {
        this.event.emit('up');
    }
    public optionDown(): void {
        this.event.emit( 'down');
    }

    public change(): void {
        this.option.name = this.option.text;
        this.option.name = this.option.name.replace( /\s/g, ' ' );
        if ( this.option.name.length > 50 ) this.option.name = this.option.name.substring( 0, 49 )+'…';
    }

    public get canEditOption(): boolean {
        return this.model.data.new_with_id || this.model.checkAccess('edit');
    }

    public get canDeleteOption(): boolean {
        return this.model.data.new_with_id || this.model.checkAccess('delete');
    }

    public get canMoveOption(): boolean {
        return this.canEditOption;
    }

}
