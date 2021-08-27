/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';
import { userpreferences} from '../../../services/userpreferences.service';

@Component( {
    selector: 'question-render-text',
    templateUrl: './src/modules/questionnaires/templates/questionrendertext.html',
    styles: [
        '.questionset-render .sequenced { font-family: monospace; }',
        '.questionset-render table.sequenced { margin: 0 0 0 auto; }',
        // 'div.question-render-question:last-child { margin-bottom: 0 !important; }',
        'div.question-render-question { border-radius:0; }'
    ]
} )
export class QuestionRenderText extends QuestionRenderBasic implements OnInit {

    @Input() private hideFinishedQuestions = false;
    private lengthLongestSequence = 0;
    private questionNameSplitted: any[] = [];
    private isInputInvalid = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService, public userpreferences: userpreferences ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {

        super.ngOnInit();

        if ( this.questionMeta.parameter.sequenced ) {
            let i = 0;
            this.questionNameSplitted = this.question.name.split(',');
            if ( this.questionNameSplitted.length > this.lengthLongestSequence ) this.lengthLongestSequence = this.questionNameSplitted.length;
        }

    }

    /**
     * Setter for the text value.
     * Can handle numeric values.
     * @param val
     * @private
     */
    private set value( val: string ) {
        val = val.trim();
        if ( this.questionMeta.parameter.numeric && val !== '' ) {
            let pref = this.userpreferences.toUse;
            val = val.split(pref.num_grp_sep).join('');
            val = val.split(pref.dec_sep).join('.');
            this.isInputInvalid = isNaN( Number( val ));
            if( !this.isInputInvalid ) this.questionnaireParticipation.setAnswerValue( this.questionId, (parseFloat( val )).toString() );
            else this.questionnaireParticipation.setAnswerValue( this.questionId, val );
            return;
        }
        this.questionnaireParticipation.setAnswerValue( this.questionId, val );
        this.isInputInvalid = false;
    }

    /**
     * Getter for the text value.
     * Can handle numeric values.
     * @private
     */
    private get value(): string {
        let val = this.qp.answers[this.questionId].answer_value;
        if ( this.questionMeta.parameter.numeric ) {
            val = val.split( '.' ).join( this.userpreferences.toUse.dec_sep );
        }
        return val;
    }

    private forLoopArray( numElements: number ): any[] {
        return new Array(numElements);
    }

    /**
     * The CSS styling for the html element "box", in case the question is from type "binary".
     * The styling might be affected by a previous or following binary question.
     */
    private binaryTableStyle() {
        let style: any = {};
        /*
        if ( this.isToMergeWithPreviousQuestion ) {
            style['border-top'] = 'none';
        }

         */
        if ( this.isToMergeWithFollowingQuestion ) {
            style['border-bottom'] = 'none';
            style['margin-bottom'] = '-1rem';
        }
        return style;
    }

    /**
     * Should the question rendered together with the previous question?
     */
    /*
    public get isToMergeWithPreviousQuestion() {
        if ( this.questionMeta.parameter.sequenced
            && this.previousQuestion
            && this.previousQuestion.questiontype === 'text'
            && this.qp.questionsMeta[this.previousQuestion.id].parameter.sequenced
        ) {
            return true;
        }
        return false;
    }

     */

    /**
     * Should the question rendered together with the following question?
     */
    public get isToMergeWithFollowingQuestion() {
        if ( this.questionMeta.parameter.sequenced
            && this.followingQuestion
            && this.followingQuestion.questiontype === 'text'
            && this.qp.questionsMeta[this.followingQuestion.id].parameter.sequenced
        ) return true;
        return false;
    }

}
