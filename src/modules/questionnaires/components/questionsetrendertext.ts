/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {session} from '../../../services/session.service';
import {toast} from "../../../services/toast.service";

@Component( {
    selector: 'questionset-render-text',
    templateUrl: './src/modules/questionnaires/templates/questionsetrendertext.html',
    styles: [
        '.questionset-render .sequenced { font-family: monospace; }',
        '.questionset-render table.sequenced { margin: 0 0 0 auto; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
} )
export class QuestionsetRenderText {

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
    private lengthLongestSequence = 0;
    private questionNamesSplitted: any[] = [];
    private sequenced = false;

    constructor( private language: language, private backend: backend, private session: session, private toast: toast ) { }

    @Input() public get numOfFinishedQuestions(): number {
        return this.numOfFinishedQuestionsValue;
    }

    public set numOfFinishedQuestions( val: number ) {
        this.numOfFinishedQuestionsValue = val;
        this.numOfFinishedQuestionsChange.emit( this.numOfFinishedQuestionsValue );
    }

    public ngOnInit(): void {

        if ( this.questionset.questiontypeparameter !== '' ) {
            let config = JSON.parse( this.questionset.questiontypeparameter );
            if ( config.text && config.text.sequenced ) {
                this.sequenced = config.text.sequenced;
                let i = 0;
                for ( let question of this.questions ) {
                    this.questionNamesSplitted[i] = question.name.split(',');
                    if ( this.questionNamesSplitted[i].length > this.lengthLongestSequence ) this.lengthLongestSequence = this.questionNamesSplitted[i].length;
                    i++;
                }
            }
        }

        if ( !this.previewMode ) {
            this.backend.getRequest( 'module/QuestionSets/' + this.questionset.id + '/answervalues/' + this.participation_id ).subscribe(
                data => {
                    for( let question of this.questions ) {
                        if ( data[question.id] ) this.answers[question.id] = data[question.id].optionlessAnswerValue;
                        this.questionsMeta[question.id].tempReadonly = false;
                        this.questionsMeta[question.id].finished = true;
                    }
                    this.determineNumOfFinishedQuestions();
                });

        }

    }

    private onTextFocus( questionId: string ): void {
        this.backupForNetworkError = this.answers[questionId];
    }

    private onTextChange( questionId: string ): boolean {

        // If the preview mode is set, a text input/change is allowed but is not to be treated. --> Do nothing and return true.
        if ( this.previewMode ) return true;

        // If the edit mode is not set, a input/change is not allowed and is not to be treated. --> Do nothing and return false.
        if ( this.noEdit ) return false;

        // Is the input field of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input field is disabled.
        if ( this.questionsMeta[questionId].tempReadonly ) return false;

        // At the beginning disable the input field of the question. It will stay disabled until server response at the end.
        this.questionsMeta[questionId].tempReadonly = true;
        this.backend.postRequest( 'module/Questions/' + questionId + '/answervalues/' + this.participation_id, {},
            { optionlessAnswerValue: this.answers[questionId] } ).subscribe(
            data => {
                this.answers[questionId] = data.optionlessAnswerValue;
                this.questionsMeta[questionId].tempReadonly = false; // Enable the input field of the question.
                this.determineNumOfFinishedQuestions();
            },
            error => {
                this.questionsMeta[questionId].tempReadonly = false;
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_SAVING'),'error', error.message,false );
                this.answers[questionId] = this.backupForNetworkError;
            }
        );

        return true;
    }

    private determineNumOfFinishedQuestions(): void {
        let numberQuestions: number = 0;
        for( let question of this.questions ) {
            if( this.answers[question.id].length && this.answers[question.id] && this.answers[question.id] != '' ) {
                this.questionsMeta[question.id].finished = true;
                numberQuestions++;
            } else this.questionsMeta[question.id].finished = false;
        }
        this.numOfFinishedQuestions = numberQuestions;
    }

    private forLoopArray( numElements: number ): any[] {
        return new Array(numElements);
    }

}
