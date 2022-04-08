/**
 * @module ModuleQuestionnaire
 */
import { Component, EventEmitter, Input, Output, SkipSelf } from "@angular/core";
import {model} from "../../../services/model.service";
import { language } from '../../../services/language.service';
import { metadata } from '../../../services/metadata.service';

@Component({
    selector: 'questionnaire-editor-questionset-add',
    templateUrl: "../templates/questionnaireeditorquestionsetadd.html",
    providers: [model]
})
export class QuestionnaireEditorQuestionsetAdd {

    // @Input() public questionnaire: model;
    @Input() public disabled = false;
    @Output() public newQuestionset: EventEmitter<any> = new EventEmitter();

    constructor( public model: model, public lang: language, public metadata: metadata, @SkipSelf() public questionnaire: model ) {
        this.model.module = 'QuestionSets';
    }

    public addQuestionset(): void {
        this.model.id = ''; // we want addModel() to generate a new bean
        this.model.addModel('', this.questionnaire, null, true )
            .subscribe( newQuestionset => this.newQuestionset.emit( newQuestionset ));
    }

    public get canAdd() {
        return this.questionnaire.checkAccess('edit') && this.metadata.checkModuleAcl('QuestionSets', 'create');
    }

}

