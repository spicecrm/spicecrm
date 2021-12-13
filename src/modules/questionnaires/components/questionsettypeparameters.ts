/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'questionset-type-parameters',
    templateUrl: '../templates/questionsettypeparameters.html'
})
export class QuestionsetTypeParameters implements OnInit {

    public sectionIsOpen = true;
    public questiontypeFieldconfig = { readonly: false };

    constructor( public language: language, public model: model, public toast: toast ) { }

    public ngOnInit(): void {
        if ( this.model.isLoading ) {
            this.model.data$.subscribe( () => this.doWhenLoaded() );
        } else this.doWhenLoaded();
    }

    // to do:   Wenn in QuestionsManagerAddModal in erste Fragen angelegt werden oder alle Fragen gelöscht werden,
    //          reagiert das Feld "questiontype" mit seinem readonly-Status nicht. Sind zwei verschiedene Models, wissen voneinander nix.

    public doWhenLoaded(): void {
        if ( this.questionsetHasQuestions() ) this.questiontypeFieldconfig.readonly = true;
    }

    public toggleSection(): void {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    public getOpenStyle() {
        if ( !this.sectionIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

    public questionsetHasQuestions(): boolean {
        let questionsExists = false;
        if ( this.model && this.model.data && this.model.data.questions ) {
            questionsExists = (Object.keys( this.model.data.questions.beans ).length !== 0 );
        }
        return questionsExists;
    }

}
