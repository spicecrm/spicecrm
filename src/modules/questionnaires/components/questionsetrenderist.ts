/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, Pipe, EventEmitter, Output } from '@angular/core';
import { language } from '../../../services/language.service';
import { backend } from "../../../services/backend.service";
import { session } from '../../../services/session.service';
import { toast } from '../../../services/toast.service';

@Pipe({name: 'questiontypeisttextspipe'})
export class QuestionTypeISTTextPipe {

    private transform( value ): any[] {
        let retArray = [];
        let iteration = 0;
        let foundValue = true;

        while( iteration < 5 && value !== false ) {
            value = this.findNext(value, retArray, iteration);
            iteration++;
        }

        return retArray;
    }

    private findNext( value, items, iteration ): string|false {
        let nextPos = value.indexOf('?');
        if( nextPos >= 0 ) {
            if( nextPos > 0 ) {
                items.push({
                    type: 'text',
                    text: value.substring( 0, nextPos )
                });
            }

            items.push({
                type: 'option',
                index: iteration
            });

            return value.substring( nextPos + 1 );

        } else {
            items.push({
                type: 'text',
                text: value
            });
            return false;
        }
    }

}
@Pipe({name: 'questiontypeistoptionspipe'})
export class QuestionTypeISTOptionsPipe {
    private transform( values ) {
        if ( values ) return values.split(',');
        else return [];
    }
}

@Component( {
    selector: 'questionset-render-ist',
    templateUrl: './src/modules/questionnaires/templates/questionsetrenderist.html',
    styles: [ 'div.questionset-render-question:last-child { margin-bottom: 0 !important; }' ]
} )
export class QuestionsetRenderIST {

    @Input() public answers: any = {};
    @Input() public hideFinishedQuestions = false;
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

    constructor( private language: language, private backend: backend, private session: session, private toast: toast  ) { }

    @Input() public get numOfFinishedQuestions() {
        return this.numOfFinishedQuestionsValue;
    }

    public set numOfFinishedQuestions( val ) {
        this.numOfFinishedQuestionsValue = val;
        this.numOfFinishedQuestionsChange.emit( this.numOfFinishedQuestionsValue );
    }

    private getAnswerValue( questionId: string, answerIndex: number ): string {
        try {
            return this.answers.questionId[answerIndex].value;
        } catch(e) {
            return '';
        }
    }

    public ngOnInit(): void {

        if ( !this.previewMode ) {
            this.backend.getRequest( 'module/QuestionSets/' + this.questionset.id + '/answervalues/' + this.participation_id ).subscribe(
                data => {
                    for( let question of this.questions ) {
                        if( data[question.id] ) this.setFieldsOfQuestion( question.id, data[question.id] );
                        this.questionsMeta[question.id].readonly = false;
                    }
                    this.determineNumOfFinishedQuestions();
                });
        }
    }

    private onChange( questionId: string, answerIndex: number, event: any ): boolean {

        // If the preview mode is set, a change is allowed but is not to be treated. --> Do nothing and return true.
        if ( this.previewMode ) return true;

        // If the edit mode is not set, a change is not allowed and is not to be treated. --> Do nothing and return false.
        if ( this.noEdit ) return false;

        // Are the input fields of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input fields are disabled.
        if ( this.questionsMeta[questionId].readonly ) return false;

        // At the beginning disable the input field(s) of the question. They will stay disabled until server response at the end.
        this.questionsMeta[questionId].readonly = true;

        this.backupForNetworkError = JSON.stringify( this.answers.questionId );

        // Get the answer from the input field and store it.
        this.answers.questionId[answerIndex].value = event.target.value;

        // The data for the server request with the answer values (true or false).
        let requestData = {};
        for ( let i = 0; i < this.answers.questionId.length; i++ ) {
            if ( this.answers.questionId[i].value === '' ) this.answers.questionId[i].value = false;
            requestData[this.options[questionId][i].id] = this.answers.questionId[i].value;
        }

        // Do the request to the server to store the current answer state of the whole question.
        this.backend.postRequest( 'module/Questions/' + questionId + '/answervalues/' + this.participation_id, {}, requestData ).subscribe(
            data => {
                this.questionsMeta[questionId].readonly = false;
                this.determineNumOfFinishedQuestions();
            },
            error => {
                this.questionsMeta[questionId].readonly = false;
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_SAVING'),'error', error.message,false );
                this.answers.questionId = JSON.parse( this.backupForNetworkError );
            }
        );

        return true;

    }

    private setFieldsOfQuestion( questionId: string, answervalues: any ): void {
        for ( let answer of this.answers.questionId ) {
            answer.value = (answervalues[answer.optionId] || false);
        }
    }

    private determineNumOfFinishedQuestions(): void {
        let numberQuestions = 0;
        let unFinished = false;
        for( let question of this.questions ) {
            for( let answer of this.answers[question.id] ) {
                if( answer.value === false ) {
                    unFinished = true;
                    break;
                }
            }
            if ( !unFinished ) {
                numberQuestions++;
                this.questionsMeta[question.id].finished = true;
            }
            unFinished = false;
        }
        this.numOfFinishedQuestions = numberQuestions;
    }

}
