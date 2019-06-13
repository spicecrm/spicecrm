/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { language } from '../../../services/language.service';
import { backend } from "../../../services/backend.service";
import { helper } from '../../../services/helper.service';

/**
* @ignore
*/
declare var _: any;

@Component( {
    selector: 'questionset-render',
    templateUrl: './src/modules/questionnaires/templates/questionsetrender.html',
    styles: [
        '.questionset-render.in-modal .questionset-render-header, .questionset-render.in-modal .questionset-render-footer { flex-grow: 0; flex-shrink: 0; }',
        '.questionset-render.in-modal .questionset-render-questions { flex-shrink: 1; flex-grow: 1; overflow-y: scroll; }',
        '.questionset-render.in-modal { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }',
        '.questionset-render-text.collapsed { border-bottom-style: dashed; border-bottom-width: 2px; }',
        '.questionset-render-text.collapsed div:first-child { overflow-y: hidden; position: relative; height: 3rem; }',
        '.questionset-render-transition { background: linear-gradient(to bottom, rgba(243,242,242,0) 0%, rgba(243,242,242,1) 100%); height: 2rem; position: absolute; bottom: 0; left: 0; right: 0; }'
    ],
    providers: [helper]
} )
export class QuestionsetRender implements OnInit {

    @Input() public questionsetidorobject: any;
    @Input() public participation_id: string;
    @Input() public noEdit = false;
    @Input() public inModal = true;
    @Input() public timerText: string = null;
    @Input() public timerWarning = false;
    @Input() public hideFinishedQuestions = false;

    private answers = {};
    private imageWidthOption = 200;
    private imageWidthQuestion = 200;
    private isLoading = true;
    private numOfFinishedQuestionsValue = 0;
    private options = {};
    private previewMode = false;
    private questions: any[] = [];
    private questionset: any;
    private questionsMeta = {};
    private textIsCollapsed = false;

    private isCompleteChange = new EventEmitter();

    constructor( private language: language, private backend: backend, private helperservice: helper ) { }

    private set numOfFinishedQuestions( val ) {
        this.numOfFinishedQuestionsValue = val;
        this.isCompleteChange.emit( this.questions.length === val );
    }

    private get numOfFinishedQuestions(): number {
        return this.numOfFinishedQuestionsValue;
    }

    public ngOnInit(): void {

        if ( this.participation_id ) this.previewMode = false;
        else this.previewMode = true;

        if ( typeof this.questionsetidorobject === 'string' ) {
            this.backend.getRequest( 'module/QuestionSets/renderer/' + this.questionsetidorobject ).subscribe( ( response: any ) => {
                this.questionset = response;
                this.doWhenLoaded();
            } );
        } else {
            this.questionset = this.questionsetidorobject;
            this.doWhenLoaded();
        }

    }

    private doWhenLoaded(): void {

        if( this.questionset.data ) this.questionset = this.questionset.data;

        if( this.questionset.questions && this.questionset.questions.beans ) {

            // Put the questions into an array, sort them by the field "position" (and date_entered) or shuffle them.
            let keys = Object.keys( this.questionset.questions.beans );
            if( this.questionset.shuffle == 1 ) {
                this.helperservice.shuffle( keys );
            } else {
                keys.sort( ( a, b ) => {
                let dummy = this.questionset.questions.beans[a].position - this.questionset.questions.beans[b].position;
                if( dummy !== 0 ) return dummy;
                else {
                    if( this.questionset.questions.beans[a].date_entered < this.questionset.questions.beans[b].date_entered ) return -1;
                    if( this.questionset.questions.beans[a].date_entered > this.questionset.questions.beans[b].date_entered ) return 1;
                    return 0;
                }
            } );
            }
            for ( let key of keys ) this.questions.push( this.questionset.questions.beans[key] );

            // Build meta data for all questions.
            for ( let question of this.questions ) {
                this.questionsMeta[question.id] = {
                    readonly: !this.previewMode,
                    finished: false,
                    parameter: {}
                };
            }

        }

        // Put the answer options into an object/array, grouped by the questions.
        for( let question of this.questions ) {
            if( question.questionoptions && question.questionoptions.beans ) {
                let keys = Object.keys( question.questionoptions.beans );
                if ( this.questionset.questiontype.match( /^binary|single|multi|ist$/ ) ) {
                    // Sort or shuffle the options.
                    if ( this.questionset.shuffle == 1 && this.questionset.questiontype.match( /^binary|single|multi$/ ) ) {
                        this.helperservice.shuffle( keys );
                    } else {
                        keys.sort( ( a, b ) => {
                            return question.questionoptions.beans[a].position - question.questionoptions.beans[b].position;
                        } );
                    }
                }
                this.options[question.id] = [];
                if ( !this.previewMode ) this.answers[question.id] = [];
                for ( let key of keys ) {
                    this.options[question.id].push( question.questionoptions.beans[key] );
                    if ( !this.previewMode ) {
                        this.answers[question.id].push({
                            optionId: question.questionoptions.beans[key].id,
                            value: false
                        });
                    }
                }
            }
        }

        this.isLoading = false;

    }

    private toggleText(): void {
        this.textIsCollapsed = !this.textIsCollapsed;
    }

}
