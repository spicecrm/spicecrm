/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { language } from '../../../services/language.service';
import { backend } from "../../../services/backend.service";
import { session } from '../../../services/session.service';
import {toast} from "../../../services/toast.service";

@Component( {
    selector: 'questionset-render-binary-single-multi',
    templateUrl: './src/modules/questionnaires/templates/questionsetrenderbinarysinglemulti.html',
    styles: [
        'td.binary-left-text, td.binary-right-radio { border-right-width: 0; }',
        'td.binary-right-text, td.binary-left-radio { border-left-width: 0; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
})
export class QuestionsetRenderBinarySingleMulti implements OnInit {

    @Input() answers: any = {};
    @Input() hideFinishedQuestions: boolean = false;
    @Input() imageWidthOption = 200;
    @Input() imageWidthQuestion = 200;
    @Input() in_modal: boolean = true;
    @Input() no_edit: boolean = false;
    @Input() options: any = {};
    @Input() participation_id: string;
    @Input() previewMode: boolean;
    @Input() questions: Array<any> = [];
    @Input() questionset: any;
    @Input() questionsMeta = {};

    @Output() numOfFinishedQuestionsChange = new EventEmitter();
    numOfFinishedQuestionsValue: number = 0;

    backupForNetworkError: string;

    constructor( private language: language, private backend: backend, private session: session, private toast: toast ) { }

    @Input()
    get numOfFinishedQuestions() {
        return this.numOfFinishedQuestionsValue;
    }

    set numOfFinishedQuestions( val ) {
        this.numOfFinishedQuestionsValue = val;
        this.numOfFinishedQuestionsChange.emit( this.numOfFinishedQuestionsValue );
    }

    ngOnInit() {

        // Maybe some questions have specific parameters stored.
        // So we parse the question parameters (stored as json string) and put it to questionsMeta.
        for ( let question of this.questions )
            if ( question.questionparameter ) this.questionsMeta[question.id].parameter = JSON.parse( question.questionparameter );

        if ( !this.previewMode ) {
            this.backend.getRequest( 'module/QuestionSets/' + this.questionset.id + '/answervalues/' + this.participation_id ).subscribe(
                data => {
                    for( let question of this.questions ) {
                        if( data[question.id] ) this.setFieldsOfQuestion( question.id, data[question.id] );
                        this.questionsMeta[question.id].readonly = false;
                    }
                    this.determineNumOfFinishedQuestions();
                } );
        }
    }

    setFieldsOfQuestion( questionId: string, answervalues: any ) {
        for ( let answer of this.answers[questionId] )
            answer.value = ( answervalues[answer.optionId] || false );
    }

    onClick( questionId: string, answerIndex: number, event: any ): boolean {

        // If the preview mode is set, a click is allowed but is not to be treated. --> Do nothing and return true.
        if ( this.previewMode ) return true;

        // If the edit mode is not set, a click is not allowed and is not to be treated. --> Do nothing and return false.
        if ( this.no_edit ) return false;

        // Are the input fields of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input fields are disabled.
        if ( this.questionsMeta[questionId].readonly ) return false;

        // At the beginning disable the input field(s) of the question. They will stay disabled until server response at the end.
        this.questionsMeta[questionId].readonly = true;

        // In case of single or binary choice question:
        if ( this.questionset.questiontype === 'single' || this.questionset.questiontype === 'binary' ) {

            // Radio button already set? --> Nothing to do.
            if ( this.answers[questionId][answerIndex].value ) {
                this.questionsMeta[questionId].readonly = false;
                return;
            }

            this.backupForNetworkError = JSON.stringify( this.answers[questionId] );

            // Set the (other) answers to false, the selected to true
            for( let i = 0; i < this.answers[questionId].length; i++ ) this.answers[questionId][i].value = false;
            this.answers[questionId][answerIndex].value = true;

        } else { // questiontype is 'multi'

            // In case of multiple choice question check if the number of maximal answers is already reached:
            if( event.target.checked && this.questionsMeta[questionId].parameter.maxAnswers && this.questionsMeta[questionId].parameter.maxAnswers !== '' ) {
                let numChecked = 0;
                for( let answer of this.answers[questionId] ) {
                    if( answer.value === true ) numChecked++;
                    if( numChecked >= this.questionsMeta[questionId].parameter.maxAnswers ) {
                        this.questionsMeta[questionId].readonly = false;
                        return false;
                    }
                }
            }

            this.backupForNetworkError = JSON.stringify( this.answers[questionId] );

            // Get the answer from the input field (true or false) and store it.
            this.answers[questionId][answerIndex].value = event.target.checked;

        }

        // The data for the server request with the answer values (true or false).
        var requestData = {};
        for ( let i = 0; i < this.answers[questionId].length; i++ )
            requestData[this.options[questionId][i].id] = this.answers[questionId][i].value;

        // Do the request to the server to store the current answer state of the whole question.
        this.backend.postRequest( 'module/Questions/' + questionId + '/answervalues/' + this.participation_id, {}, requestData ).subscribe(
            data => {
                this.setFieldsOfQuestion( questionId, data );
                this.questionsMeta[questionId].readonly = false;
                this.determineNumOfFinishedQuestions();
            },
            error => {
                this.questionsMeta[questionId].readonly = false;
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_SAVING'),'error',error.message,false );
                this.answers[questionId] = JSON.parse( this.backupForNetworkError );
            }
        );

        return true;

    }

    determineNumOfFinishedQuestions() {
        let numberQuestions: number = 0;
        let numberAnswers: number, answeredOK: boolean;
        for( let question of this.questions ) {
            numberAnswers = 0;
            answeredOK = false;
            for( let answer of this.answers[question.id] ) {
                if( answer.value ) {
                    numberAnswers++;
                    if( this.questionset.questiontype !== 'multi'
                        || ( this.questionset.questiontype === 'multi' && !this.questionsMeta[question.id].parameter.minAnswers )
                        || ( numberAnswers >= this.questionsMeta[question.id].parameter.minAnswers ) ) {
                        answeredOK = true;
                        this.questionsMeta[question.id].finished = true;
                        continue;
                    }
                }
            }
            if( answeredOK ) numberQuestions++;
        }
        this.numOfFinishedQuestions = numberQuestions;
    }

}
