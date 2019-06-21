/**
 * @module ModuleQuestionnaire
 */
import { Component, ViewChild, OnInit } from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modal} from '../../../services/modal.service';
import {QuestionnaireRender} from '../components/questionnairerender';

@Component({
    selector: 'questionnaire-editor',
    templateUrl: "./src/modules/questionnaires/templates/questionnaireeditor.html",
    providers: [relatedmodels],
    styles: [
        'slds-tabs_default__content'
    ]
})
export class QuestionnaireEditor implements OnInit {

    private questionsets: any[] = [];

    private isLoadingQuestionsets = true;

    @ViewChild(QuestionnaireRender, {static: false}) public questionnaireRender;

    constructor( private lang: language, private model: model, private backend: backend, private xquestionsets: relatedmodels, private modalservice: modal ) { }

    public ngOnInit(): void {
        if ( this.model.id ) this.loadQuestionsets();
        else {
            this.model.data$.subscribe( () => {
                this.loadQuestionsets();
            });
        }
    }

    get isLoading() {
        return this.model.isLoading && this.isLoadingQuestionsets;
    }

    private addQuestionset( newQuestionset ) {
        if ( newQuestionset ) this.questionsets.push( newQuestionset );
    }

    private reloadPreview(): void {
        this.questionnaireRender.reload();
    }

    private loadQuestionsets(): void {
        this.isLoadingQuestionsets = true;
        this.questionsets = [];
        this.backend.getRequest('module/Questionnaires/'+this.model.id+'/related/questionsets').subscribe( questionsets => {
            for (let key of Object.keys( questionsets )) this.questionsets.push( questionsets[key] );
            this.sortQuestionsets();
            this.isLoadingQuestionsets = false;
        });
    }

    private sortQuestionsets(): void {
        this.questionsets.sort((a, b) => {
            return a.position - b.position;
        });
    }

    private removeQuestionset( i: number ): void {
        this.questionsets.splice( i,1 );
    }

    private trackBy( index: number, item: any ): string {
        return item.id;
    }

}
