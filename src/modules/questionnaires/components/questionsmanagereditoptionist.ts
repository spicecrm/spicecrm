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
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditoptionist.html',
    providers: [model,view]
})
export class QuestionsManagerEditOptionIst implements OnInit {

    @Input() categorypool;
    @Output() event: EventEmitter<any> = new EventEmitter<any>();
    @Input() option: any;
    @Input() isFirstRow: boolean;
    @Input() isLastRow: boolean;
    @Output() isDirty: boolean;

    constructor ( private language: language, private metadata: metadata, private model: model, private view: view, private modalservice: modal ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    get options(){
        return '';
    }

    set options(options){

    }

    ngOnInit() {
        this.model.module = 'QuestionOptions';
        this.model.id = this.option.id;
        this.model.data = this.option;
    }

    deleteOption () {
        this.modalservice.confirm( this.language.getLabelFormatted( 'QST_DELETE_ANSWER_OPTION_LONG', this.option.name ), this.language.getLabel('QST_DELETE_ANSWER_OPTION' )).subscribe(( answer ) => {
            if ( answer )
                this.event.emit( 'delete');
        });
    }

    change() {}

}