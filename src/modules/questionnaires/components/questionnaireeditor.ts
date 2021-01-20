/**
 * @module ModuleQuestionnaire
 */
import { Component, ViewChild, OnInit, EventEmitter } from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {QuestionnaireRender} from '../components/questionnairerender';

@Component({
    selector: 'questionnaire-editor',
    templateUrl: "./src/modules/questionnaires/templates/questionnaireeditor.html",
    styles: [
        'slds-tabs_default__content'
    ]
})
export class QuestionnaireEditor implements OnInit {

    private questionsets: any[] = [];
    private questionsetsBackup: any[] = [];

    private isLoadingQuestionsets = true;
    private changeOrderMode = false;

    private categorypool = {
        loaded: false,
        event: new EventEmitter<any>(),
        list: []
    };

    @ViewChild(QuestionnaireRender, {static:false}) public questionnaireRender;

    constructor( private lang: language, private model: model, private backend: backend,  ) { } // private questionnaireParticipation: questionnaireParticipationService

    public ngOnInit(): void {
        if ( this.model.id ) {
            this.loadQuestionsets();
            this.loadQuestionOptionCategories();
            this.createPreview();
        } else {
            this.model.data$.subscribe( () => {
                this.loadQuestionsets();
                this.loadQuestionOptionCategories();
                this.createPreview();
            });
        }
    }

    private createPreview() {
        1;
        // For the preview create a questionnaire "participation":
        // this.questionnaireParticipation.showQuestionnaireTitle = false;
        // this.questionnaireParticipation.editMode = 'preview';
        // this.questionnaireParticipation.initByQuestionnaire( this.model.id );
    }

    get isLoading() {
        return this.model.isLoading || this.isLoadingQuestionsets || !this.categorypool.loaded;
    }

    private addQuestionset( newQuestionset ) {
        if ( newQuestionset ) {
            this.questionsets.push( newQuestionset );
            this.sortQuestionsets();
        }
    }

    private reloadPreview(): void {
        this.questionnaireRender.reload();
    }

    private loadQuestionsets(): void {
        this.isLoadingQuestionsets = true;
        this.questionsets = [];
        this.backend.getRequest('module/Questionnaires/'+this.model.id+'/related/questionsets', {limit: 999}).subscribe( questionsets => {
            for (let key of Object.keys( questionsets )) this.questionsets.push( questionsets[key] );
            this.sortQuestionsets();
            this.isLoadingQuestionsets = false;
        });
    }

    private loadQuestionOptionCategories(): void {
        this.backend.getRequest('QuestionOptionCategories/getList').subscribe(( response: any ) => {
            let allCategories = response;
            if ( this.model.getField('categorypool') ) {
                let categorypool = this.model.getField('categorypool').split(',');
                allCategories.forEach( category => {
                    for ( let categoryId of categorypool ) {
                        if ( category.id === categoryId ) {
                            this.categorypool.list.push( category );
                        }
                    }
                });
            }
            this.categorypool.loaded = true;
            this.categorypool.event.emit();
        });
    }

    private sortQuestionsets(): void {
        this.questionsets.sort((a, b) => {
            return parseInt(a.position, 10 ) - parseInt( b.position, 10 );
        });
    }

    private removeQuestionset( i: number ): void {
        this.questionsets.splice( i,1 );
    }

    private trackBy( index: number, item: any ): string {
        return item.id;
    }

    private changeQuestionset( questionset: any, i: number ) {
        this.questionsets[i] = questionset;
        this.sortQuestionsets();
    }


    private changeOrderStart(): void {

        this.questionsetsBackup = this.questionsets.slice(0); // clone the questionsets array (for canceling)
        this.changeOrderMode = true;

        // Changing the order should be also cancelable by esc key:
        const this2 = this; // we need 'this' in the anonymous function 'handler'
        window.addEventListener('keyup', function handler(event) {
            if ( this2.changeOrderMode && event.keyCode === 27 ) {
                event.stopImmediatePropagation();
                this2.changeOrderCancel();
                this.removeEventListener ('click', handler );
            }
        });
    }

    private changeOrderCancel(): void {
        this.questionsets = this.questionsetsBackup;
        this.changeOrderMode = false;
    }
    private changeOrderSave(): void {
        for ( let i in this.questionsets ) {
            this.questionsets[i].position = i;
            this.backend.postRequest('module/QuestionSets/'+this.questionsets[i].id, null, '{"position":'+i+'}');
        }
        this.changeOrderMode = false;
    }
    private questionsetUp( i ): void {
        if ( i === 0 ) return;
        let tmp = this.questionsets[i-1];
        this.questionsets[i-1] = this.questionsets[i];
        this.questionsets[i] = tmp;
    }
    private questionsetDown( i ): void {
        if ( i > this.questionsets.length-1 ) return;
        let tmp = this.questionsets[i+1];
        this.questionsets[i+1] = this.questionsets[i];
        this.questionsets[i] = tmp;
    }

}
