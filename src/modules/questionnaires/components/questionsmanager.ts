/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { backend } from '../../../services/backend.service';
import { modal } from '../../../services/modal.service';
import { QuestionsManagerAddModal } from './questionsmanageraddmodal';
import { metadata } from '../../../services/metadata.service';

@Component({
    selector: 'questions-manager',
    templateUrl: '../templates/questionsmanager.html'
})
export class QuestionsManager implements OnInit {

    @Input() public showQuestionsetButtons = false;
    @Input() public categorypool: any;
    @Output() public questionsetAction: EventEmitter<string> = new EventEmitter();
    @Input() public questionnaire: model;

    public questions: any[] = [];
    public currentQuestionId = '';
    public isLoading = true;
    public questiontypes = ['single','multi','binary','rating','nps','ist','text'];
    public questiontypes_dom: any;

    constructor( public language: language, public model: model, public backend: backend, public modalservice: modal, public metadata: metadata ) { }

    public ngOnInit(): void {
        this.questiontypes_dom = this.language.getDisplayOptions('questionstypes_dom');
        this.backend.getRequest('module/QuestionSets/'+this.model.id+'/related/questions', {limit: 999} ).subscribe( (response: any) => {
            for ( let id in response ) {
                this.questions.push( this.model.utils.backendModel2spice('Questions', response[id] ));
            }
            // Sort questions by field "position" (number). Only in case "position" is equal then use "date_entered".
            this.questions = this.questions.sort(( a, b ) => {
                let deltaPos = a.position - b.position;
                if ( deltaPos === 0 ) {
                    return a.date_entered === b.date_entered ? 0 : a.date_entered > b.date_entered ? 1 : -1;
                } else return deltaPos;
            });
            this.isLoading = false;
        });
    }

    public addQuestion( questiontype, event ): void {
        event.preventDefault();
        this.currentQuestionId = '';
        this.openForm( questiontype );
    }

    public editQuestion(questionId): void {
        this.currentQuestionId = questionId;
        this.openForm();
    }

    public openForm( questiontype: string = null ): void {
        this.modalservice.openModal('QuestionsManagerAddModal' ).subscribe( form => {
            form.instance.questionset = this.model;
            form.instance.questionid = this.currentQuestionId;
            form.instance.categorypool = this.categorypool;
            form.instance.questiontype = questiontype;
            form.instance.response.subscribe( response => {
                this.handleFormResponse( response );
            });
        });
    }

    public getIndexOfQuestion( questionId: string ): number {
        let indexOfQuestion: number;
        this.questions.some((question, index) => {
            if (question.id === questionId) {
                indexOfQuestion = index;
                return true;
            }
        });
        return indexOfQuestion;
    }

    public deleteQuestion( questionId ): void {
        // First get the index position of the question. Because we only know the id of the question.
        let indexOfQuestion: number = this.getIndexOfQuestion(questionId);
        this.modalservice.confirm(
            this.language.getLabelFormatted( 'QST_DELETE_QUESTION_LONG', this.questions[indexOfQuestion].name ),
            this.language.getLabel( 'QST_DELETE_QUESTION' )).subscribe( ( answer ) => {
                if ( answer ) {
                    this.backend.deleteRequest( 'module/Questions/' + questionId );
                    this.questions.splice( indexOfQuestion, 1 );
                }
        });
    }

    public handleFormResponse( event ): void {
        if (event !== false) {
            if ( this.currentQuestionId === '' ) {
                this.questions.push( event );
            } else {
                this.questions.some( question => {
                   if ( question.id == event.id ) {
                       question.name = event.name;
                       return true;
                   }
                });
            }
        }
    }

    public drop(event) {
        let previousItem = this.questions.splice( event.previousIndex, 1 );
        this.questions.splice( event.currentIndex, 0, previousItem[0] );
        let updateArray = [];
        let i = 0;
        for ( let item of this.questions ) {
            item.position = i;
            updateArray.push({ id: item.id, position: i });
            i++;
        }
        this.backend.putRequest('module/QuestionSets/'+this.model.id+'/related/beans/questions', null, { beans: updateArray });
    }

    public dragStarted(e) {
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    public dragEnded(e) {
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

    private get canEditQuestionnaire(): boolean {
        return this.questionnaire?.checkAccess('edit');
    }

    private get canMoveQuestionset(): boolean {
        return this.canEditQuestionnaire && this.canEditQuestionset;
    }

    private get canEditQuestionset(): boolean {
        return this.model.checkAccess('edit');
    }

    public canEditQuestion( question ): boolean {
        return !!question.acl?.edit;
    }

    public canDeleteQuestion( question ): boolean {
        return !!question.acl?.delete && this.canEditQuestionset;
    }

    public get canDeleteQuestionset(): boolean {
        return this.canEditQuestionnaire && this.model.checkAccess('delete');
    }

    public get canAddQuestions(): boolean {
        return this.canEditQuestionset && this.metadata.checkModuleAcl('Questions', 'create');
    }

    public canMoveQuestion( question ): boolean {
        return this.canEditQuestionset && this.canEditQuestion( question );
    }

}
