/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component( {
    selector: 'questionset-render-binary-single-multi',
    templateUrl: './src/modules/questionnaires/templates/questionsetrenderbinarysinglemulti.html',
    styles: [
        'td.binary-left-text, td.binary-right-radio { border-right-width: 0; }',
        'td.binary-right-text, td.binary-left-radio { border-left-width: 0; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
})
export class QuestionsetRenderBinarySingleMulti extends QuestionsetRenderBasic implements OnInit {

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    private isChecked( questionId: string, optionId: string ): boolean {
        return this.qp.answers[questionId].options[optionId];
    }

}
