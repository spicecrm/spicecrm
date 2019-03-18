/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: '[questions-manager-edit-option-single-multi]',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditoptionsinglemulti.html',
    providers: [model,view]
})
export class QuestionsManagerEditOptionSingleMulti implements OnInit {

    @Input() categorypool;
    @Output() event: EventEmitter<any> = new EventEmitter<any>();
    @Input() option: any;
    @Input() isFirstRow: boolean;
    @Input() isLastRow: boolean;
    @Input() hasInfosCorrectness: boolean;
    @Output() isDirty: boolean;

    constructor ( private language: language, private metadata: metadata, private model: model, private view: view, private modalservice: modal ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        this.model.module = 'QuestionOptions';
        this.model.id = this.option.id;
        this.model.data = this.option;
    }

    deleteOption () {
        this.modalservice.confirm( this.language.getLabelFormatted('QST_DELETE_ANSWER_OPTION_LONG', this.option.name ),
            this.language.getLabel('QST_DELETE_ANSWER_OPTION')).subscribe( ( answer ) => {
                if ( answer )
                    this.event.emit( 'delete');
            });
    }

    onChange_isCorrectOption( event ) {
        this.option.is_correct_option = event.target.checked;
    }

    optionUp() {
        this.event.emit('up');
    }
    optionDown() {
        this.event.emit( 'down');
    }

    change() {
    }

}