/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { backend } from '../../../services/backend.service';
import { model } from '../../../services/model.service';
import { userpreferences } from '../../../services/userpreferences.service';

@Component({
    selector: 'questionnaire-entire-evaluation',
    templateUrl: './src/modules/questionnaires/templates/questionnaireentireevaluation.html'
})
export class QuestionnaireEntireEvaluation implements OnInit {

    @Input('questionnaireId') public inputQuestionnaireId: string;

    private questionnaireId: string;

    private questionnaire: any;
    private questionsets: any[] = [];
    private questions = {};
    private options = {};

    private answers: any = {};
    private countQuestionnaireParticipations: number;

    private isLoadingQuestionnaire: boolean; // = true;
    private isLoadingQuestionsets: boolean; // = true;
    private isLoadingAnswers: boolean; // = true;

    private imageWidthQuestion = 200;
    private imageWidthOption = 200;

    private relativeTo = 'questionnaires'; // questionnaires fill out | questions fill out

    constructor( private backend: backend, private model: model, private userPreferences: userpreferences ) { }

    public ngOnInit(): void {
        this.questionnaireId = this.inputQuestionnaireId !== undefined ? this.inputQuestionnaireId : this.model.id;

        this.loadQuestionnaire();
        this.loadQuestionsets();
        this.loadAnwers();

    }

    private loadQuestionnaire() {
        if ( this.isLoadingQuestionnaire ) return;
        this.isLoadingQuestionnaire = true;
        if ( this.questionnaireId ) {
            this.backend.getRequest( 'module/Questionnaires/' + this.questionnaireId ).subscribe( ( response: any ) => {
                this.questionnaire = response;
                this.isLoadingQuestionnaire = false;
            } );
        } else {
            this.questionnaire = this.model.data;
            this.isLoadingQuestionnaire = false;
        }
    }

    private loadAnwers(): void {
        if ( this.isLoadingAnswers ) return;
        this.isLoadingAnswers = true;
        this.backend.getRequest( 'module/Questionnaires/'+this.questionnaireId+'/answers/allParticipations' ).subscribe( data => {
            this.answers = data.answers;
            this.countQuestionnaireParticipations = data.countQuestionnaireParticipations;
            this.isLoadingAnswers = false;
        } );
    }

    private get isLoading(): boolean {
        return this.isLoadingQuestionsets || this.isLoadingQuestionnaire || this.isLoadingAnswers;
    }

    private loadQuestionsets(): void {
        if ( this.isLoadingQuestionsets ) return;
        this.isLoadingQuestionsets = true;
        this.questionsets = [];
        this.backend.getRequest('module/Questionnaires/'+this.questionnaireId+'/related/questionsets', {limit: 999}).subscribe( questionsets => {

            for ( let key of Object.keys( questionsets )) this.questionsets.push( questionsets[key] );
            this.questionsets.sort(( a, b ) => a.position - b.position );

            for ( let questionset of this.questionsets ) {

                // Parse the question type parameter (from the question set, json):
                questionset.questiontypeparameter = ( questionset.questiontypeparameter && questionset.questiontypeparameter !== '' ? JSON.parse( questionset.questiontypeparameter ) : {} );

                this.questions[questionset.id] = [];
                if ( questionset.questions && questionset.questions.beans ) {

                    // Put the questions into an array, sort them by the field "position" (and date_entered).
                    let keys = Object.keys( questionset.questions.beans );
                    keys.sort( ( a, b ) => {
                        let dummy = questionset.questions.beans[a].position - questionset.questions.beans[b].position;
                        if ( dummy !== 0 ) return dummy;
                        else {
                            if ( questionset.questions.beans[a].date_entered < questionset.questions.beans[b].date_entered ) return -1;
                            if ( questionset.questions.beans[a].date_entered > questionset.questions.beans[b].date_entered ) return 1;
                            return 0;
                        }
                    });
                    for ( let key of keys ) this.questions[questionset.id].push( questionset.questions.beans[key] );


                    for ( let question of this.questions[questionset.id] ) {
                        this.options[question.id] = [];
                        if ( question.questionoptions && question.questionoptions.beans ) {
                            let keys = Object.keys( question.questionoptions.beans );
                            if ( question.questiontype.match( /^binary|single|multi|ist|rating$/ ) ) {
                                // Sort the options.
                                keys.sort( ( a, b ) => {
                                    return question.questionoptions.beans[a].position - question.questionoptions.beans[b].position;
                                });
                                for ( let key of keys ) {
                                    this.options[question.id].push( question.questionoptions.beans[key] );
                                }
                            } else {
                                // In case of question type "rating" the options of each question has to be assigned to the predefined options from the question set.
                                // In case of a rating question set: Get the answer options from the field "questiontypeparameter".
                                if ( questionset.questiontype === 'ratinggroup' && questionset.questiontypeparameter.rating ) {
                                    let sortedOptions = [];
                                    for ( let entry of questionset.questiontypeparameter.rating.entries ) {
                                        let isOptionFound = false;
                                        for ( let key of keys ) {
                                            if ( question.questionoptions.beans[key].questionset_type_parameter_id === entry.id ) {
                                                isOptionFound = true;
                                                sortedOptions.push( question.questionoptions.beans[key] );
                                                break;
                                            }
                                        }
                                        if( !isOptionFound ) sortedOptions.push( {} );
                                    }
                                    this.options[question.id] = sortedOptions;
                                }
                            }
                        }

                    }

                }

            }

            this.isLoadingQuestionsets = false;

        });
    }

    private getEvaluationValue( questionId: string, optionId: string ): number {
        try {
            return this.answers[questionId].optionCounts[optionId] === undefined ? 0 : this.answers[questionId].optionCounts[optionId];
        } catch (e) {
            return 0;
        }
    }

    private countQuestionParticipations( questionId: string ): number {
        try {
            return this.answers[questionId].countParticipations;
        } catch (e) {
            return 0;
        }
    }

    public reload(): void {
        if ( !this.isLoading ) {
            this.loadQuestionnaire();
            this.loadQuestionsets();
            this.loadAnwers();
        }
    }

    private getQuestionParticipationBarWidth( questionId ) {
        try {
            return {
                width: this.countQuestionParticipations( questionId ) / this.countQuestionnaireParticipations * 100 + '%'
            };
        } catch (e) {
            return 0;
        }
    }

    private getAnswerBarWidth( questionId, optionId ) {
        try {
            return {
                width: ( this.answers[questionId].optionCounts[optionId] === undefined ? 0 : this.answers[questionId].optionCounts[optionId] ) / ( this.relativeTo === 'questionnaires' ? this.countQuestionnaireParticipations : this.answers[questionId].countParticipations ) * 100 + '%'
            };
        } catch (e) {
            return 0;
        }
    }

    private getQuestionParticipationsInPercent( questionId: string ): string {
        try {
            return ( this.userPreferences.formatMoney( this.answers[questionId].countParticipations / this.countQuestionnaireParticipations * 100, 2 ));
        } catch (e) {
            return '0,00';
        }
    }

    private allOptionsNumeric( questionId: string ): boolean {
        for ( let option of this.options[questionId] ) {
            if ( isNaN( option.name )) return false;
        }
        return true;
    }

    private averageOfAnswers( questionId: string ): string {
        try {
            return (this.userPreferences.formatMoney( this.answers[questionId].answer_value / this.answers[questionId].countParticipations, 2 ));
        } catch (e) {
            return '0,00';
        }
    }

    private questionIsToShow( question: any ): boolean {
        return /^ratinggroup|rating|nps|single|multi|binary$/.test( question.questiontype );
    }

    private questionsetIsToShow( questionset: any ): boolean {
        for ( let id in questionset.questions.beans ) {
            if ( /^ratinggroup|rating|nps|single|multi|binary$/.test( questionset.questions.beans[id].questiontype )) return true;
        }
        return false;
    }

}
