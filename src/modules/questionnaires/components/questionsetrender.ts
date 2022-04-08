/**
 * @module ModuleQuestionnaires
 */
import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { helper } from '../../../services/helper.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { language } from '../../../services/language.service';

/**
 * @ignore
 */
declare var _: any;

@Component( {
    selector: 'questionset-render',
    templateUrl: '../templates/questionsetrender.html',
    styles: [
        '.questionset-render.in-modal .questionset-render-header, .questionset-render.in-modal .questionset-render-footer { flex-grow: 0; flex-shrink: 0; }',
        '.questionset-render.in-modal .questionset-render-questions { flex-shrink: 1; flex-grow: 1; overflow-y: scroll; }',
        '.questionset-render.in-modal { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }',
        '.collapsed div.questionset-render-text { max-height: 4rem; overflow: hidden; }',
        '.questionset-render-textbefore-fadeout { display: none; background: linear-gradient(to bottom, rgba(243,242,242,0) 0%, rgba(243,242,242,1) 100%); height: 5rem; position: absolute; bottom: 0; left: 0; right: 0; padding: 0 1rem 1rem 1rem; border-radius: 0.25rem; }',
        '.collapsed div.questionset-render-textbefore-fadeout { display: block; }'
    ],
    providers: [helper]
} )
export class QuestionsetRender implements OnInit {

    public _ = _; // Workaround to use _ (underscore.js) inside the html template.

    public qp: questionnaireParticipationService;

    @Input() public questionsetId: string;
    @Input() public showProgress = false;
    @Input() public hideFinishedQuestions = false;
    @Input() imageWidthQuestion = 200;
    @Input() imageWidthOption = 200;

    public questionset: any;

    public textIsCollapsable = false;
    public textIsCollapsed = false;

    @ViewChild('box', {read: ElementRef, static: false}) public box: ElementRef;

    public isCompleteChange = new EventEmitter();

    constructor( public language: language, public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit(): void {

        // window.setTimeout( () => { this.zeig = true; }, 5000 );
        this.questionset = this.questionnaireParticipation.questionnaire.questionsets[this.questionsetId];

        // setTimeout() is a workaround
        window.setTimeout( () => {
            if ( this.box && this.box.nativeElement.clientHeight > 64 ) this.textIsCollapsable = true;
        },1 );

    }

    public toggleText(): void {
        this.textIsCollapsed = !this.textIsCollapsed;
    }

    public get percentOfFinishedQuestions(): number {
        return this.questionnaireParticipation.percentOfFinishedQuestionsInQuestionset[this.questionsetId];
    }

    public get allQuestionsFinished(): number {
        return this.questionnaireParticipation.allQuestionsOfQuestionsetFinished[this.questionsetId];
    }

}
