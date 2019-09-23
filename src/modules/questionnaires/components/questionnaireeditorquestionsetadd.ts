/**
 * @module ModuleQuestionnaire
 */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {model} from "../../../services/model.service";
import { language } from '../../../services/language.service';

@Component({
    selector: 'questionnaire-editor-questionset-add',
    templateUrl: "./src/modules/questionnaires/templates/questionnaireeditorquestionsetadd.html",
    providers: [model]
})
export class QuestionnaireEditorQuestionsetAdd {

    @Input() public questionnaire: model;
    @Input() public disabled = false;
    @Output() public newQuestionset: EventEmitter<any> = new EventEmitter();

    constructor( private model: model, private lang: language ) {
        this.model.module = 'QuestionSets';
    }

    private addQuestionset(): void {
        this.model.addModel('', this.questionnaire, null, true )
            .subscribe( newQuestionset => this.newQuestionset.emit( newQuestionset ));
    }

}

