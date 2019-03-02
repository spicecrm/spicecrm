/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { language } from '../../../services/language.service';
import { backend } from "../../../services/backend.service";
import { session } from '../../../services/session.service';
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

    @Input() answers: any = {};
    @Input() hideFinishedQuestions: boolean = false;
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
    lengthLongestSequence: number = 0;
    questionNamesSplitted: Array<any> = [];
    sequenced: boolean = false;

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
                        if( data[question.id] ) this.answers[question.id].text_input = data[question.id].text;
                        this.questionsMeta[question.id].readonly = false;
                        this.questionsMeta[question.id].finished = true;
                    }
                    this.determineNumOfFinishedQuestions();
                });

        }

    }

    onTextFocus( questionId: string ) {
        this.backupForNetworkError = this.answers[questionId].text_input;
    }

    onTextChange( questionId: string ): boolean {

        // If the preview mode is set, a text input/change is allowed but is not to be treated. --> Do nothing and return true.
        if ( this.previewMode ) return true;

        // If the edit mode is not set, a input/change is not allowed and is not to be treated. --> Do nothing and return false.
        if ( this.no_edit ) return false;

        // Is the input field of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input field is disabled.
        if ( this.questionsMeta[questionId].readonly ) return false;

        // At the beginning disable the input field of the question. It will stay disabled until server response at the end.
        this.questionsMeta[questionId].readonly = true;
        this.backend.postRequest( 'module/Questions/' + questionId + '/answervalues/' + this.participation_id, {},
            { 'text': this.answers[questionId].text_input } ).subscribe(
            data => {
                this.answers[questionId].text_input = data.text;
                this.questionsMeta[questionId].readonly = false; // Enable the input field of the question.
                this.determineNumOfFinishedQuestions();
            },
            error => {
                this.questionsMeta[questionId].readonly = false;
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_SAVING'),'error', error.message,false );
                this.answers[questionId].text_input = this.backupForNetworkError;
            }
        );

        return true;
    }

    //char( n: number ): string {
    //    return String.fromCharCode( 97 + n );
    //}

    determineNumOfFinishedQuestions() {
        let numberQuestions: number = 0;
        for( let question of this.questions ) {
            if( this.answers[question.id].length && this.answers[question.id].text_input && this.answers[question.id].text_input != '' ) {
                this.questionsMeta[question.id].finished = true;
                numberQuestions++;
            } else
                this.questionsMeta[question.id].finished = false;
        }
        this.numOfFinishedQuestions = numberQuestions;
    }

    private forLoopArray( numElements: number ): Array<any> {
        return new Array(numElements);
    }

}
