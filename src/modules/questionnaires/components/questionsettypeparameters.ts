/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";


@Component({
    selector: 'questionset-type-parameters',
    templateUrl: './src/modules/questionnaires/templates/questionsettypeparameters.html'
})
export class QuestionsetTypeParameters implements OnInit {

    sectionIsOpen: boolean = true;
    // backupQuestionType: string;
    questiontypeFieldconfig = { readonly:false };

    constructor(private language: language, private model: model, private toast:toast ) { }

    ngOnInit() {
        if ( this.model.isLoading )
            this.model.data$.subscribe( () => {
                this.doWhenLoaded();
            });
        else this.doWhenLoaded();
    }

    // to do:   Wenn in QuestionsManagerAddModal in erste Fragen angelegt werden oder alle Fragen gelöscht werden,
    //          reagiert das Feld "questiontype" mit seinem readonly-Status nicht. Sind zwei verschiedene Models, wissen voneinander nix.

    doWhenLoaded() {
        if ( this.questionsetHasQuestions() ) {
            this.questiontypeFieldconfig.readonly = true;
        }
    }

    toggleSection() {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    getOpenStyle() {
        if (!this.sectionIsOpen)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

    questionsetHasQuestions() {
        let questionsExists = false;
        if ( this.model && this.model.data && this.model.data.questions )
            questionsExists = (Object.keys(this.model.data.questions.beans).length !== 0);
        return questionsExists;
    }

    /*
    change() {
        if ( this.questionsetHasQuestions() ) {
            this.model.data.questiontype = this.backupQuestionType;
            this.toast.sendToast(this.language.getLabel('MSG_CANTCHANGE_QUESTIONSEXISTS'), 'error', '', true);
        } else this.backupQuestionType = this.model.data.questiontype;
    }
    */

}
