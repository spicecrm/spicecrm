/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import { modal } from '../../../services/modal.service';
import { QuestionsManagerAddModal } from './questionsmanageraddmodal';


@Component({
    selector: 'questions-manager',
    templateUrl: './src/modules/questionnaires/templates/questionsmanager.html'
})
export class QuestionsManager implements OnInit {

    questions: Array<any> = [];
    questionsBackup: Array<any> = [];
    currentQuestionId: string = '';
    changeOrderMode: boolean = false;

    constructor( private language: language, private model: model, private backend: backend, private modalservice: modal ) { }

    ngOnInit() {
        let params = {
            searchfields: {
                field: 'questionset_id',
                operator: '=',
                value: this.model.id
            },
            fields: ['id', 'name', 'position'], //JSON.stringify(['id', 'name', 'position']),
            sortfield: 'position,date_entered',
            limit: -99
        };
        this.backend.getRequest('module/Questions', params ).subscribe( (response: any) => {
            this.questions = response.list;
        });
    }

    addQuestion() {
        this.currentQuestionId = '';
        this.openForm();
    }

    editQuestion(questionId) {
        this.currentQuestionId = questionId;
        this.openForm();
    }

    openForm() {
        this.modalservice.openModal('QuestionsManagerAddModal' ).subscribe( form => {
            form.instance['questionset'] = this.model;
            form.instance['questionid'] = this.currentQuestionId;
            form.instance['response'].subscribe( response => {
                this.handleFormResponse( response );
            });
        });
    }

    getIndexOfQuestion(questionId:string) : number {
        let indexOfQuestion: number;
        this.questions.some((question, index) => {
            if (question.id === questionId) {
                indexOfQuestion = index;
                return true;
            }
        });
        return indexOfQuestion;
    }

    deleteQuestion(questionId) {
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

    handleFormResponse( event) {
        if (event !== false) {
            if ( this.currentQuestionId === '' )
                this.questions.push(event)
            else {
                this.questions.some( question => {
                   if ( question.id == event.id ) {
                       question.name = event.name;
                       return true;
                   }
                });
            }
        }
    }

    changeOrderStart() {
        this.questionsBackup = this.questions.slice(0); // clone the questions array (for canceling)
        this.changeOrderMode = true;
    }
    changeOrderCancel() {
        this.questions = this.questionsBackup;
        this.questionDown(5);
        this.changeOrderMode = false;
    }
    changeOrderSave() {
        for ( let i in this.questions ) {
            this.questions[i].position = i;
            this.backend.postRequest('module/Questions/'+this.questions[i].id, null, '{"position":'+i+'}');
        }
        this.changeOrderMode = false;
    }
    questionUp(i) {
        if ( i === 0 ) return;
        let tmp = this.questions[i-1];
        this.questions[i-1] = this.questions[i];
        this.questions[i] = tmp;
    }
    questionDown(i) {
        if ( i > this.questions.length-1 ) return;
        let tmp = this.questions[i+1];
        this.questions[i+1] = this.questions[i];
        this.questions[i] = tmp;
    }

}