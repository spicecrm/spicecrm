/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {session} from '../../../services/session.service';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'questionset-render-rating',
    templateUrl: './src/modules/questionnaires/templates/questionsetrenderrating.html',
    styles: [
        "table { border-top: none; }",
        "th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}",
        "tr:first-child td { border-top: none; }"
    ]
})
export class QuestionsetRenderRating implements OnInit {

    @Input() public answers: any = {};
    @Input() public hideFinishedQuestions = false;
    @Input() public imageWidthQuestion = 200;
    @Input() public inModal = true;
    @Input() public noEdit = false;
    @Input() public options: any = {};
    @Input() public participation_id: string;
    @Input() public previewMode: boolean;
    @Input() public questions: any[] = [];
    @Input() public questionset: any;
    @Input() public questionsMeta = {};

    @Output() public numOfFinishedQuestionsChange = new EventEmitter();
    private numOfFinishedQuestionsValue = 0;

    private backupForNetworkError: string;
    private ratingEntries: any[] = [];
    private ratingNumEntries = 0;
    private ratingValuesHaveAlsoText = false;

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
        if (this.questionset.questiontypeparameter !== '') {
            let config = JSON.parse(this.questionset.questiontypeparameter);
            if (config.rating) {
                this.ratingNumEntries = config.rating.numEntries;
                this.ratingEntries = config.rating.entries;
            }
        }
        for (let question of this.questions) {
            let sortedOptions = [];
            let sortedAnswers = [];
            for (let entry of this.ratingEntries) {
                let isOptionFound: boolean = false;
                for (let i = 0; i < this.options[question.id].length; i++) {
                    if (this.options[question.id][i].questionset_type_parameter_id === entry.id) {
                        isOptionFound = true;
                        sortedOptions.push(this.options[question.id][i]);
                        if (!this.previewMode) sortedAnswers.push(this.answers[question.id][i]);
                        break;
                    }
                }
                if (!isOptionFound) {
                    sortedOptions.push({});
                    if (!this.previewMode) sortedAnswers.push({});
                }
            }
            this.options[question.id] = sortedOptions;
            if (!this.previewMode) this.answers[question.id] = sortedAnswers;

        }

        // Is there any rating value with an alternative text?
        for ( let entry of this.ratingEntries ) if ( entry.text !== '' ) { this.ratingValuesHaveAlsoText = true; break; }

        if ( !this.previewMode ) {
            this.backend.getRequest( 'module/QuestionSets/' + this.questionset.id + '/answervalues/' + this.participation_id ).subscribe(
                data => {
                    for( let question of this.questions ) {
                        if ( !this.answers[question.id] ) this.answers[question.id] = [];
                        if( data[question.id] ) this.setFieldsOfQuestion( question.id, data[question.id] );
                        this.questionsMeta[question.id].tempReadonly = false;
                    }
                    this.determineNumOfFinishedQuestions();
                } );

        }

    }

    private setFieldsOfQuestion( questionId: string, answerValues: any ): void {
        for (let answer of this.answers[questionId]) {
            answer.value = ( answerValues[answer.optionId] || false );
        }
    }

    private onClick( questionId: string, answerIndex: number, event: any): boolean {

        // If the preview mode is set, a click is allowed but is not to be treated. --> Do nothing and return true.
        if (this.previewMode) return true;

        // If the edit mode is not set, a click is not allowed and is not to be treated. --> Do nothing and return false.
        if (this.noEdit) return false;

        // Are the input fields of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input fields are disabled.
        if ( this.questionsMeta[questionId].tempReadonly ) return false;

        // At the beginning disable the input field(s) of the question. They will stay disabled until server response at the end.
        this.questionsMeta[questionId].tempReadonly = true;

        // Radio button already set? --> Nothing to do.
        if ( this.answers[questionId][answerIndex].value ) {
            this.questionsMeta[questionId].tempReadonly = false;
            return;
        }

        this.backupForNetworkError = JSON.stringify( this.answers[questionId] );

        // Set the (other) answers to false.
        this.answers[questionId].forEach( ( el, index ) => this.answers[questionId][index].value = false );

        // Store the answer (true)
        this.answers[questionId][answerIndex].value = true;

        // The data for the server request with the answer values (true or false).
        let requestData = {};
        for (let i = 0; i < this.answers[questionId].length; i++) {
            requestData[this.options[questionId][i].id] = this.answers[questionId][i].value;
        }

        // Do the request to the server to store the current answer state of the whole question.
        this.backend.postRequest('module/Questions/' + questionId + '/answervalues/' + this.participation_id, {}, requestData ).subscribe(
            data => {
                this.setFieldsOfQuestion(questionId, data);
                this.questionsMeta[questionId].tempReadonly = false;
                this.determineNumOfFinishedQuestions();
            },
            error => {
                this.questionsMeta[questionId].tempReadonly = false;
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_SAVING'),'error', error.message+'. '+ ( error.error.error.message ? error.error.error.message:'' ),false );
                this.answers[questionId] = JSON.parse( this.backupForNetworkError );
            }
        );

        return true;

    }

    private determineNumOfFinishedQuestions(): void {
        let numberQuestions = 0;
        for( let question of this.questions ) {
            for( let answer of this.answers[question.id] ) {
                if( answer.value ) {
                    this.questionsMeta[question.id].finished = true;
                    numberQuestions++;
                    continue;
                }
            }
        }
        this.numOfFinishedQuestions = numberQuestions;
    }

}
