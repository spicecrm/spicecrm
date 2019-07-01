/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {session} from '../../../services/session.service';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'questionset-render-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsetrendernps.html',
    styles: [
        "table { border-top: none; }",
        "th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}",
        "tr:first-child td { border-top: none; }"
    ]
})
export class QuestionsetRenderNPS implements OnInit {

    @Input() public answers: any = {};
    @Input() public hideFinishedQuestions = false;
    @Input() public imageWidthQuestion = 200;
    @Input() public inModal = true;
    @Input() public noEdit = false;
    @Input() public participation_id: string;
    @Input() public previewMode: boolean;
    @Input() public questions: any[] = [];
    @Input() public questionset: any;
    @Input() public questionsMeta = {};

    @Output() public numOfFinishedQuestionsChange = new EventEmitter();
    private numOfFinishedQuestionsValue = 0;

    private backupForNetworkError: string;
    private textForScore0 = '';
    private textForScore10 = '';

    constructor(private language: language, private backend: backend, private session: session, private toast: toast ) { }

    @Input() public get numOfFinishedQuestions() {
        return this.numOfFinishedQuestionsValue;
    }

    public set numOfFinishedQuestions( val ) {
        this.numOfFinishedQuestionsValue = val;
        this.numOfFinishedQuestionsChange.emit( this.numOfFinishedQuestionsValue );
    }

    public ngOnInit() {

        // In case of question type "rating" the options of each question has to be assigned to the predefined options from the question set.
        // In case of a rating question set: Get the answer options from the field "questiontypeparameter".
        if ( this.questionset.questiontypeparameter !== '' ) {
            let config = JSON.parse(this.questionset.questiontypeparameter);
            if ( config.nps ) {
                this.textForScore0 = config.nps.textForScore0;
                this.textForScore10 = config.nps.textForScore10;
            }
        }

        if ( !this.previewMode ) {
            this.backend.getRequest( 'module/QuestionSets/' + this.questionset.id + '/answervalues/' + this.participation_id ).subscribe(
                data => {
                    for ( let question of this.questions ) {
                        if ( data[question.id] ) this.answers[question.id] = data[question.id].optionlessAnswerValue;
                        this.questionsMeta[question.id].readonly = false;
                        this.questionsMeta[question.id].finished = true;
                    }
                    this.determineNumOfFinishedQuestions();
                } );

        }

    }

    private onClick( questionId: string, score: number, event: any): boolean {

        // If the preview mode is set, a click is allowed but is not to be treated. --> Do nothing and return true.
        if (this.previewMode) return true;

        // If the edit mode is not set, a click is not allowed and is not to be treated. --> Do nothing and return false.
        if (this.noEdit) return false;

        // Are the input fields of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input fields are disabled.
        if ( this.questionsMeta[questionId].readonly ) return false;

        // At the beginning disable the input field(s) of the question. They will stay disabled until server response at the end.
        this.questionsMeta[questionId].readonly = true;

        // Score already set? --> Nothing to do.
        if ( this.answers[questionId] === score ) {
            this.questionsMeta[questionId].readonly = false;
            return;
        }

        this.backupForNetworkError = JSON.stringify( this.answers[questionId] );

        // Store the answer/score.
        this.answers[questionId] = score;

        // Do the request to the server to store the current answer state of the whole question.
        this.backend.postRequest('module/Questions/' + questionId + '/answervalues/' + this.participation_id,
            { optionlessAnswerValue: this.answers[questionId] } ).subscribe(
            data => {
                this.answers[questionId] = data.optionlessAnswerValue;
                this.questionsMeta[questionId].readonly = false; // Enable the input field of the question.
                this.determineNumOfFinishedQuestions();
            },
            error => {
                this.questionsMeta[questionId].readonly = false;
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_SAVING'),'error', error.message+'. '+ ( error.error.error.message ? error.error.error.message:'' ),false );
                this.answers[questionId] = this.backupForNetworkError;
            }
        );

        return true;

    }

    private determineNumOfFinishedQuestions(): void {
        let numberQuestions = 0;
        for( let question of this.questions ) {
            for ( let answer of this.answers[question.id] ) {
                if ( answer.value ) {
                    this.questionsMeta[question.id].finished = true;
                    numberQuestions++;
                    continue;
                }
            }
        }
        this.numOfFinishedQuestions = numberQuestions;
    }

}
