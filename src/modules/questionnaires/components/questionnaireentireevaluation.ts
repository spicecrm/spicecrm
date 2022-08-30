/**
 * @module ModuleQuestionnaires
 */
import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { backend } from '../../../services/backend.service';
import { model } from '../../../services/model.service';
import { userpreferences } from '../../../services/userpreferences.service';
import { take } from 'rxjs/operators';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'questionnaire-entire-evaluation',
    templateUrl: '../templates/questionnaireentireevaluation.html'
})
export class QuestionnaireEntireEvaluation implements OnInit {

    @Input('questionnaireId') public inputQuestionnaireId: string;

    public questionnaireId: string;

    public questionnaire: any;
    public questionsets: any[] = [];
    public questions = {};
    public options = {};

    public answers: any = {};
    public countQuestionnaireParticipations: number;

    public isLoadingQuestionnaire: boolean; // = true;
    public isLoadingQuestionsets: boolean; // = true;
    public isLoadingAnswers: boolean; // = true;

    public imageWidthQuestion = 200;
    public imageWidthOption = 200;

    public relativeTo = 'questionnaires'; // questionnaires fill out | questions fill out

    /**
     * Data for the export (base64 url).
     */
    public loadUrl: any = undefined;

    /**
     * File name for the export.
     */
    public downloadFilename: string = 'QuestionnaireEvaluation.pdf';

    /**
     * Indicator for exporting process.
     */
    public isExporting = false;

    /**
     * The start date of the evaluation period (input field).
     */
    public startdate;

    /**
     * The end date of the evaluation period (input field).
     */
    public enddate;

    /**
     * The start date of the evaluation period shown on the screen.
     */
    public startdateOfShownEvaluation;

    /**
     * The end date of the evaluation period shown on the screen.
     */
    public enddateOfShownEvaluation;

    /**
     * Is the start date valid?
     */
    public isStartdateValid: boolean;

    /**
     * Is the end date valid?
     */
    public isEnddateValid: boolean;

    public startdateEdited = false;
    public enddateEdited = false;

    /**
     * The part of the html page which has to get exported.
     */
    @ViewChild('forExport', {read: ElementRef, static: false}) public htmlForExport: ElementRef;

    /**
     * A reference to the export download link.
     */
    @ViewChild('downloadlink', {read: ViewContainerRef, static: true }) public downloadlink: ViewContainerRef;

    /**
     * Has an evaluation already got loaded?
     */
    public hasInitialLoadingStarted = false;

    /**
     * Is an export possible, can it be provided by the backend?
     */
    public isExportPossible = false;

    constructor( public backend: backend, public model: model, public userPreferences: userpreferences ) { }

    public ngOnInit(): void {
        this.questionnaireId = this.inputQuestionnaireId !== undefined ? this.inputQuestionnaireId : this.model.id;
        this.loadQuestionnaire();
        this.loadQuestionsets();
    }

    public initialLoad(): void {
        if ( !this.datesValid ) return;
        this.hasInitialLoadingStarted = true;
        this.loadAnwers();
    }

    public loadQuestionnaire(): void
    {
        if ( this.isLoadingQuestionnaire ) return;
        this.isLoadingQuestionnaire = true;

        if ( this.questionnaireId ) {
            this.backend.getRequest( 'module/Questionnaires/' + this.questionnaireId ).subscribe({
                next: ( response: any ) => {
                    this.questionnaire = response;
                    this.isLoadingQuestionnaire = false;
                },
                error: () => {
                    this.isLoadingQuestionnaire = false;
                }});
        } else {
            this.questionnaire = this.model.data;
            this.isLoadingQuestionnaire = false;
        }
    }

    public loadAnwers(): void
    {
        if ( this.isLoadingAnswers ) return;
        this.isLoadingAnswers = true;

        let startdateAsString: string, enddateAsString: string;
        if ( this.startdate instanceof moment ) startdateAsString = moment( this.startdate ).utc().format('YYYY-MM-DD');
        if ( this.enddate instanceof moment ) enddateAsString = moment( this.enddate ).utc().format('YYYY-MM-DD');
        this.enddateOfShownEvaluation = this.enddate;
        this.startdateOfShownEvaluation = this.startdate;
        this.startdateEdited = this.enddateEdited = false;

        this.backend.getRequest( 'module/Questionnaires/'+this.questionnaireId+'/answers/allParticipations', { startdate: startdateAsString, enddate: enddateAsString } ).subscribe( data => {
            this.answers = data.answers;
            this.countQuestionnaireParticipations = data.countQuestionnaireParticipations;
            this.isLoadingAnswers = false;
            this.isExportPossible = !!data.isExportPossible;
        } );
    }

    public get isLoading(): boolean {
        return this.isLoadingQuestionsets || this.isLoadingQuestionnaire || this.isLoadingAnswers;
    }

    public loadQuestionsets(): void {
        if ( this.isLoadingQuestionsets ) return;
        this.isLoadingQuestionsets = true;
        this.questionsets = [];
        this.backend.getRequest('module/Questionnaires/'+this.questionnaireId+'/related/questionsets', { limit: 999, forceResolveLinks: 1 }).subscribe( questionsets => {

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

    public getEvaluationValue( questionId: string, optionId: string ): number {
        try {
            return this.answers[questionId].optionCounts[optionId] === undefined ? 0 : this.answers[questionId].optionCounts[optionId];
        } catch (e) {
            return 0;
        }
    }

    public getEvaluationValueInPercent( questionId: string, optionId: string ): string {
        let absValue = this.getEvaluationValue( questionId, optionId );
        let countParticipations;
        if ( this.relativeTo === 'questionnaires' ) {
            countParticipations = this.countQuestionnaireParticipations;
        } else {
            countParticipations = this.answers[questionId]?.countParticipations !== undefined ? this.answers[questionId].countParticipations : 0;
        }
        let relValue = ( countParticipations === 0 ? 0 : absValue / countParticipations * 100 );
        return this.userPreferences.formatMoney( relValue, 2 );
    }

    public countQuestionParticipations( questionId: string ): number {
        try {
            return this.answers[questionId].countParticipations;
        } catch (e) {
            return 0;
        }
    }

    public reload(): void {
        if ( !this.isLoading && this.datesValid ) {
            this.loadQuestionnaire();
            this.loadQuestionsets();
            this.loadAnwers();
        }
    }

    public getQuestionParticipationBarWidth( questionId: string ): object {
        let value: number;
        try {
            value = this.countQuestionParticipations( questionId ) / this.countQuestionnaireParticipations * 100;
        } catch (e) {
            value = 0;
        }
        return { width: value+'%' };
    }

    public getAnswerBarWidth( questionId: string, optionId: string ): object {
        let value: number;
        try {
            value = ( !this.answers[questionId] || this.answers[questionId].optionCounts[optionId] === undefined ? 0 : this.answers[questionId].optionCounts[optionId] ) / ( this.relativeTo === 'questionnaires' ? this.countQuestionnaireParticipations : this.answers[questionId].countParticipations ) * 100;
        } catch (e) {
            value = 0;
        }
        return { width: value+'%' };
    }

    public getQuestionParticipationsInPercent( questionId: string ): string {
        let value: number;
        try {
            value = this.answers[questionId].countParticipations / this.countQuestionnaireParticipations * 100;
        } catch (e) {
            value = 0;
        }
        return this.userPreferences.formatMoney( value, 2 );
    }

    public allOptionsNumeric( questionId: string ): boolean {
        for ( let option of this.options[questionId] ) {
            if ( isNaN( option.name )) return false;
        }
        return true;
    }

    public averageOfAnswers( questionId: string ): string {
        let value: number;
        try {
            value = this.answers[questionId].answer_value / this.answers[questionId].countParticipations;
        } catch (e) {
            value = 0;
        }
        return this.userPreferences.formatMoney( value, 2 );
    }

    public questionIsToShow( question: any ): boolean {
        return /^ratinggroup|rating|nps|single|multi|binary$/.test( question.questiontype );
    }

    public questionsetIsToShow( questionset: any ): boolean {
        for ( let id in questionset.questions.beans ) {
            if ( /^ratinggroup|rating|nps|single|multi|binary$/.test( questionset.questions.beans[id].questiontype )) return true;
        }
        return false;
    }

    /**
     * Export evaluation by submitting the html code (of the ui-rendered evaluation) to the backend, which will return it as pdf file.
     */
    public export(): void {
        if ( this.isLoading || !this.isExportPossible ) return;
        let html = this.htmlForExport.nativeElement.innerHTML;
        this.isExporting = true;
        this.backend.getDownloadPostRequestFile('module/Questionnaires/'+this.questionnaireId+'/entireEvaluationExport', null, {
            html: html,
            startdate: this.startdateOfShownEvaluation ? this.userPreferences.formatDate( this.startdateOfShownEvaluation ) : undefined,
            enddate: this.enddateOfShownEvaluation ? this.userPreferences.formatDate( this.enddateOfShownEvaluation ) : undefined,
            questionnaireName: this.questionnaire.name
        })
            .pipe(take(1))
            .subscribe({
                next: url => {
                    this.isExporting = false;
                    this.downloadlink.element.nativeElement.href = url;
                    this.downloadlink.element.nativeElement.click();
                },
                error: () => {
                    this.isExporting = false;
                }
            });
    }

    /**
     * Set time of the start date to start of the day
     */
    public startdateChanged(): void {
        if ( this.startdate && this.startdate instanceof moment ) {
            this.startdate.set( {
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            });
            this.startdateEdited = !moment( this.startdateOfShownEvaluation ).isSame( this.startdate );
        }
    }

    /**
     * Set time of end date to end of the day
     */
    public enddateChanged(): void {
        if ( this.enddate && this.startdate instanceof moment ) {
            this.enddate.set( {
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 999
            });
            this.enddateEdited = !moment( this.enddateOfShownEvaluation ).isSame( this.enddate );
        }
    }

    /**
     * Are the start and the end date valid (in case they are provided)?
     */
    public get datesValid(): boolean {
        if ( !this.isStartdateValid || !this.isEnddateValid ) return false;
        if ( this.startdate && this.enddate && this.enddate < this.startdate ) return false;
        return true;
    }

}
