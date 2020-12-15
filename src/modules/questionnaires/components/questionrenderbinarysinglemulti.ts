/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { language } from '../../../services/language.service';
import { backend } from "../../../services/backend.service";
import { session } from '../../../services/session.service';
import {toast} from "../../../services/toast.service";
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component( {
    selector: 'question-render-binary-single-multi',
    templateUrl: './src/modules/questionnaires/templates/questionrenderbinarysinglemulti.html',
    styles: [
        'td.binary-left-text, td.binary-right-radio { border-right-width: 0; }',
        'td.binary-right-text, td.binary-left-radio { border-left-width: 0; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
})
export class QuestionRenderBinarySingleMulti extends QuestionRenderBasic implements OnInit {

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    private onClick( optionId: string ): boolean {
        return this.questionnaireParticipation.clickAnswerOption( optionId );
    }

}
