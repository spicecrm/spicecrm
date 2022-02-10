/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: '[questions-manager-edit-option-ist]',
    templateUrl: '../templates/questionsmanagereditoptionist.html',
    providers: [model,view]
})
export class QuestionsManagerEditOptionIst implements OnInit {

    @Input() public categorypool;
    @Output() public event: EventEmitter<any> = new EventEmitter<any>();
    @Input() public option: any;
    @Input() public isFirstRow: boolean;
    @Input() public isLastRow: boolean;
    @Output() public isDirty: boolean;

    constructor( public language: language, public metadata: metadata, public model: model, public view: view, public modalservice: modal ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        this.model.module = 'QuestionOptions';
        this.model.id = this.option.id;
        this.model.setData(this.option);
    }

    public deleteOption(): void {
        this.modalservice.confirm( this.language.getLabelFormatted( 'QST_DELETE_ANSWER_OPTION_LONG', this.option.name ), this.language.getLabel('QST_DELETE_ANSWER_OPTION' )).subscribe( answer => {
            if ( answer ) this.event.emit( 'delete');
        });
    }

    public change() {
        null;
    }

    public get canEditOption(): boolean {
        return this.model.getField('new_with_id') || this.model.checkAccess('edit');
    }

    public get canDeleteOption(): boolean {
        return this.model.getField('new_with_id') || this.model.checkAccess('delete');
    }

}
