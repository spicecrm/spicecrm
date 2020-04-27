/**
 * @module ModuleQuestionnaires
 */
import { Component, ContentChild, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import { modal } from '../../../services/modal.service';
import { QuestionsManagerAddModal } from './questionsmanageraddmodal';
import { modellist } from '../../../services/modellist.service';

@Component({
    selector: 'questions-manager',
    templateUrl: './src/modules/questionnaires/templates/questionsmanager.html'
})
export class QuestionsManager implements OnInit {

    @Input() public noTitle = false;
    @Input() public showQuestionsetButtons = false;
    @Output() public questionsetAction: EventEmitter<string> = new EventEmitter();
    @Input('disabled') public componentDisabled = false;

    private questions: any[] = [];
    private questionsBackup: any[] = [];
    private currentQuestionId = '';
    private changeOrderMode = false;
    private isLoading = true;

    constructor( private language: language, private model: model, private backend: backend, private modalservice: modal ) { }

    public ngOnInit(): void {
        this.backend.getRequest('module/QuestionSets/'+this.model.id+'/related/questions' ).subscribe( (response: any) => {
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

    private addQuestion(): void {
        this.currentQuestionId = '';
        this.openForm();
    }

    private editQuestion(questionId): void {
        this.currentQuestionId = questionId;
        this.openForm();
    }

    private openForm(): void {
        this.modalservice.openModal('QuestionsManagerAddModal' ).subscribe( form => {
            form.instance.questionset = this.model;
            form.instance.questionid = this.currentQuestionId;
            form.instance.response.subscribe( response => {
                this.handleFormResponse( response );
            });
        });
    }

    private getIndexOfQuestion( questionId: string ): number {
        let indexOfQuestion: number;
        this.questions.some((question, index) => {
            if (question.id === questionId) {
                indexOfQuestion = index;
                return true;
            }
        });
        return indexOfQuestion;
    }

    private deleteQuestion( questionId ): void {
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

    private handleFormResponse( event ): void {
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

    private changeOrderStart(): void {

        this.questionsBackup = this.questions.slice(0); // clone the questions array (for canceling)
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
        this.questions = this.questionsBackup;
        this.changeOrderMode = false;
    }
    private changeOrderSave(): void {
        for ( let i in this.questions ) {
            this.questions[i].position = i;
            this.backend.postRequest('module/Questions/'+this.questions[i].id, null, '{"position":'+i+'}');
        }
        this.changeOrderMode = false;
    }
    private questionUp( i ): void {
        if ( i === 0 ) return;
        let tmp = this.questions[i-1];
        this.questions[i-1] = this.questions[i];
        this.questions[i] = tmp;
    }
    private questionDown( i ): void {
        if ( i > this.questions.length-1 ) return;
        let tmp = this.questions[i+1];
        this.questions[i+1] = this.questions[i];
        this.questions[i] = tmp;
    }

}
