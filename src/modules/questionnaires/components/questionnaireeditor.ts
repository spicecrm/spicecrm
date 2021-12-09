/**
 * @module ModuleQuestionnaire
 */
import { Component, ViewChild, OnInit, EventEmitter } from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {QuestionnaireRender} from '../components/questionnairerender';
import { modelutilities } from '../../../services/modelutilities.service';

@Component({
    selector: 'questionnaire-editor',
    templateUrl: "./src/modules/questionnaires/templates/questionnaireeditor.html",
    styles: [
        'slds-tabs_default__content'
    ]
})
export class QuestionnaireEditor implements OnInit {

    private questionsets: any[] = [];

    private isLoadingQuestionsets = true;

    private categorypool = {
        loaded: false,
        event: new EventEmitter<any>(),
        list: []
    };

    @ViewChild(QuestionnaireRender, {static:false}) public questionnaireRender;

    constructor( private lang: language, private model: model, private backend: backend, private modelutilities: modelutilities ) { } // private questionnaireParticipation: questionnaireParticipationService

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
            for (let key of Object.keys( questionsets )) {
                for ( let fieldName in questionsets[key] ) {
                    questionsets[key][fieldName] = this.modelutilities.backend2spice( 'QuestionSets', fieldName, questionsets[key][fieldName] );
                }
                this.questionsets.push( questionsets[key] );
            }
            this.sortQuestionsets();
            this.isLoadingQuestionsets = false;
        });
    }

    private loadQuestionOptionCategories(): void {
        this.backend.getRequest('module/QuestionOptionCategories/getList').subscribe(( response: any ) => {
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

    private drop(event) {
        let previousItem = this.questionsets.splice( event.previousIndex, 1 );
        this.questionsets.splice( event.currentIndex, 0, previousItem[0] );
        let updateArray = [];
        let i = 0;
        for ( let item of this.questionsets ) {
            item.position = i;
            updateArray.push({ id: item.id, position: i });
            i++;
        }
        this.backend.putRequest('module/Questionnaires/'+this.model.id+'/related/beans/questionsets', null,{ beans: updateArray });
    }

    private dragStarted(e) {
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
