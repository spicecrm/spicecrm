/**
 * @module ModuleQuestionnaires
 */

import { EventEmitter, Injectable } from '@angular/core';
import { backend } from '../../../services/backend.service';
import { toast } from "../../../services/toast.service";
import { language } from '../../../services/language.service';
import { helper } from '../../../services/helper.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { broadcast } from "../../../services/broadcast.service";

/**
 * @ignore
 */
declare var _: any;

@Injectable()
export class questionnaireParticipationService {

    public questionnaireId: string;
    public parentId: string;
    public parentType: string;

    public questionnaire: any;

    /**
     * Some arrays to hold records sorted:
     */
    public questionsetsArray: any[] = []; // array of all question sets, sorted
    public questionsArray: {}; // array of all questions, sorted (in an object grouped by the question sets)
    public questionoptionsArray: {}; // array of all question options, sorted (in an object grouped by the questions)

    public questionoptions = {}; // Additional/direct access to question options.

    public participationId: string;

    public imageWidthQuestion = 200;

    public inModal = true;

    public timerText: string = null;
    public timerWarning = false;

    // The edit modes:
    // 'off' ... For the customer. To fill out the questionnaire is not / is no longer possible.
    // 'preview' ... For the user to preview and test the questionnaire. Filling out is possible, but the answers will not get saved.
    // 'postview' ... For the user. To view the completed questionnaire.
    // 'questionnaire' ... For the customer.
    // 'questionoption' ... For the customer. Every answer (option) will get saved immediately.
    public editMode: 'off'|'preview'|'postview'|'questionnaire'|'questionoption' = 'questionnaire';

    public percentOfFinishedQuestionsInQuestionset: any = {};
    public numOfFinishedQuestionsInQuestionset: any = {};
    public allQuestionsOfQuestionsetFinished: any = {};

    /**
     * Holds for every question an object with some additional information.
     */
    public questionsMeta = {};

    public questions = {};

    public answers: any = {};
    public answersBackup: any = {};

    public isCompleted = false;

    public initByParent = false;
    public initByParticipation = false;
    public initByQuestionnaire = false;

    public routeForSave: string;

    /**
     * isDirty indicates that one or more question answers has been given/changed and that the information is still not saved to the backend.
     */
    public _isDirty = false;
    public get isDirty(): boolean {
        return this._isDirty;
    }
    public set isDirty( value ) {
        this._isDirty = value;
        this.isDirty$.next( value );
    }
    public isDirty$ = new BehaviorSubject( false );

    /**
     * Indicator of loading status.
     */
    public _isLoadedQuestionnaire = false;
    public _isLoadedParticipation = false;
    public get isLoadedQuestionnaire(): boolean {
        return this._isLoadedQuestionnaire;
    }
    public set isLoadedQuestionnaire( value ) {
        this._isLoadedQuestionnaire = value;
        this.isLoaded$.next( this.isLoaded );
    }
    public get isLoadedParticipation(): boolean {
        return this._isLoadedParticipation;
    }
    public set isLoadedParticipation( value ) {
        this._isLoadedParticipation = value;
        this.isLoaded$.next( this.isLoaded );
    }
    public get isLoaded(): boolean {
        return this._isLoadedQuestionnaire && this._isLoadedParticipation;
    }
    public isLoaded$ = new BehaviorSubject( false );

    /**
     * isSaving indicates that the saving of the answers is in progress.
     */
    public _isSaving = false;
    public get isSaving(): boolean {
        return this._isSaving;
    }
    public set isSaving( value ) {
        this._isSaving = value;
        this.isSaving$.next( value );
    }
    public isSaving$ = new BehaviorSubject( false );

    public answersChanged$ = new EventEmitter();

    constructor( public backend: backend, public toast: toast, public language: language, public helper: helper, public broadcast: broadcast ) { }

    public init_byParent( parentId: string, parentType: string ): Observable<any> {
        this.initByParent = true;
        this.parentId = parentId;
        this.parentType = parentType;
        this.routeForSave = 'module/QuestionAnswers/ofParticipation/byParent/'+this.parentType+'/'+this.parentId;
        return this.loadParticipation_byParent();
    }

    public init_byParticipation( participationId: string ): Observable<any> {
        this.initByParticipation = true;
        this.participationId = participationId;
        this.routeForSave = 'module/QuestionAnswers/ofParticipation/byParticipation/'+this.participationId;
        return this.loadParticipation_byParticipation();
    }

    public init_byQuestionnaire( questionnaireId: string ): Observable<any> {
        this.initByQuestionnaire = true;
        this.questionnaireId = questionnaireId;
        if ( !this.editMode ) this.editMode = 'preview';
        this.routeForSave = 'module/QuestionAnswers/ofParticipation/anonymous';
        return this.loadQuestionnaire();
    }

    /**
     * An answer value was entered.
     */
    public setAnswerValue( questionId: string, value: string ): boolean {

        // If the edit mode is 'off', a input/change is not allowed and is not to be treated. --> Do nothing and return false.
        if ( this.editMode === 'off' || this.editMode === 'postview' ) return false;

        // Is the input field of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input field is disabled.
        if ( this.questionsMeta[questionId].tempReadonly ) return false;

        let backupForNetworkError;
        if ( this.editMode === 'questionoption' ) {
            backupForNetworkError = JSON.stringify( this.answers[questionId] );
        }
        this.answers[questionId].answer_value = value;
        if ( this.editMode === 'questionoption' ) this.saveSingleAnswerToBackend( questionId, backupForNetworkError );
        else this.isDirty = true;

    }

    /**
     * An option with value was entered (questiontype "ist").
     */
    public setOptionWithValue( optionId: string, value: string ): boolean {

        let question = this.questionoptions[optionId].parentQuestion;

        // If the edit mode is 'off', a input/change is not allowed. --> Do nothing and return false.
        if ( this.editMode === 'off' || this.editMode === 'postview') return false;

        // Is the input field of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input field is disabled.
        if ( this.questionsMeta[question.id].tempReadonly ) return false;

        let backupForNetworkError;
        if ( this.editMode === 'questionoption' ) {
            backupForNetworkError = JSON.stringify( this.answers[question.id] );
        }

        if ( !value ) this.answers[question.id].options[optionId] = false;
        else this.answers[question.id].options[optionId] = value;

        if ( this.editMode === 'questionoption' ) this.saveSingleAnswerToBackend( question.id, backupForNetworkError );
        else this.isDirty = true;

    }

    /**
     * Save to the backend the answers of a single question.
     * Used when edit mode is "questionoption".
     */
    public saveSingleAnswerToBackend( questionId: string, backupForNetworkError: string ): void {
        // At the beginning disable the input field of the question. It will stay disabled until server response at the end.
        this.questionsMeta[questionId].tempReadonly = true;
        this.backend.postRequest( this.routeForSave+'/'+questionId, {}, { answer: this.answers[questionId] } ).subscribe( response => {
                // this.answers[questionId].answer_value = response.answer_value; // Relevant is, what´s in the database/backend.
                this.questionsMeta[questionId].tempReadonly = false;
                this.determineNumOfFinishedQuestionsInQuestionset( this.questions[questionId].parentQuestionset.id ); // New determination of the number of finished questions.
            },
            error => {
                this.questionsMeta[questionId].tempReadonly = false; // Enable the input field of the question.
                this.toast.sendToast( this.language.getLabel( 'ERR_NETWORK_SAVING' ), 'error', error.message, false ); // Error toast for the user.
                this.answers[questionId] = JSON.parse( backupForNetworkError ); // Restore old question answer.
            });
    }

    /**
     * Determine the number of currently selected answer options (checkboxes).
     */
    public numOptionsSelected( questionId: string ): number {
        let numChecked = 0;
        if ( this.answers[questionId].options ) {
            for ( let optionId of Object.keys( this.answers[questionId].options )) {
                if ( this.answers[questionId].options[optionId] === true ) numChecked++;
            }
        }
        return numChecked;
    }

    /**
     * An answer option (radio button or checkbox) was clicked.
     */
    public clickAnswerOption( optionId: string, event: any ): boolean {

        event.stopPropagation();
        let question = this.questionoptions[optionId].parentQuestion;

        // If the edit mode is 'off' or 'postview', a input/change is not allowed. --> Do nothing and return false.
        if ( this.editMode === 'off' || this.editMode === 'postview' ) return false;

        // Is the input field of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input field is disabled.
        if ( this.questionsMeta[question.id].tempReadonly ) return false;

        // In case the edit mode is 'questionoption' the new answer will get posted to the backend immediately.
        // Because there can always be a network error, backup the old answer to restore it.
        let backupForNetworkError;
        if ( this.editMode === 'questionoption' ) {
            backupForNetworkError = JSON.stringify( this.answers[question.id] );
        }

        // Check the number of selected answer options, in case there is a maximum configured.
        // Prevent selection in case the maximum is already reached.
        if ( this.answers[question.id].options[optionId] !== true && this.questionsMeta[question.id].parameter.maxAnswers && this.questionsMeta[question.id].parameter.maxAnswers !== '' && this.numOptionsSelected( question.id ) >= this.questionsMeta[question.id].parameter.maxAnswers ) {
            return false;
        }

        let qt = question.questiontype;
        if ( qt === 'multi') {
            this.answers[question.id].options[optionId] = !this.answers[question.id].options[optionId];
        } else if ( qt === 'single' || qt ===  'rating' || qt ===  'ist' || qt === 'binary' || qt === 'ratinggroup' ) {
            Object.entries( this.answers[question.id].options ).forEach( ( [key, value] ) => {
                if ( key === optionId ) {
                    this.answers[question.id].options[optionId] = !this.answers[question.id].options[optionId];
                } else {
                    this.answers[question.id].options[key] = false;
                }
            });
        }

        if ( this.editMode === 'questionoption' ) this.saveSingleAnswerToBackend( question.id, backupForNetworkError );
        else this.isDirty = true;

        this.answersChanged$.emit();

        return true;

    }

    // toDo, to implement, instead of code in supportalquestionnaire.ts
    // public setTimer( text: string, warning: boolean ) { }

    /**
     * Load the questionnaire (with question sets, questions and question options)
     * and do all the other stuff like building arrays, sorting, building of question meta data and initializing the answers object.
     */
    public loadQuestionnaire(): Observable<any> {
        this.isLoadedParticipation = true; // Only in case there was no participation to load.
        let responseSubject = new Subject<any>();
        this.backend.getRequest( 'module/Questionnaires/'+this.questionnaireId+'/render' ).subscribe( ( response: any ) => {
            this.questionnaire = response;
            this.doBasics();
            this.buildArrays();
            this.sortData();
            this.buildQuestionMetaData();
            this.initAnswers();
            this.isLoadedQuestionnaire = true;
            responseSubject.next();
            responseSubject.complete();
        });
        return responseSubject;
    }

    /**
     * Do some basic stuff:
     * Set IDs of parents. And: Create object "questionoptions".
     */
    public doBasics() {
        if ( this.questionnaire.questionsets ) {
            for ( let questionsetId in this.questionnaire.questionsets ) {
                if ( this.questionnaire.questionsets[questionsetId].questions ) {
                    for ( let questionId in this.questionnaire.questionsets[questionsetId].questions ) {
                        this.questions[questionId] = this.questionnaire.questionsets[questionsetId].questions[questionId];
                        // For the question: Set a pointer to the parent question set:
                        this.questionnaire.questionsets[questionsetId].questions[questionId].parentQuestionset = this.questionnaire.questionsets[questionsetId];
                        if ( this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions ) {
                            for ( let optionId in this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions ) {
                                // For the question option: Set a pointer to the parent question:
                                this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions[optionId].parentQuestion = this.questionnaire.questionsets[questionsetId].questions[questionId];
                                // Create object "questionoptions":
                                this.questionoptions[optionId] = this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions[optionId];
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Because question sets, questions and question options might be displayed sorted, we have to hold them in arrays.
     * From the backend we got the data as objects. So build the arrays:
     */
    public buildArrays() {
        this.questionsetsArray = []; // Array of the question sets.
        this.questionsArray = {}; // Arrays of the questions, grouped by question set id.
        this.questionoptionsArray = {}; // Arrays of the question options, grouped by question id.
        if ( this.questionnaire.questionsets ) {
            for ( let questionsetId in this.questionnaire.questionsets ) {
                this.questionsetsArray.push( this.questionnaire.questionsets[questionsetId] ); // Fill the array of question sets.
                this.questionsArray[questionsetId] = [];
                if ( this.questionnaire.questionsets[questionsetId].questions ) {
                    for ( let questionId in this.questionnaire.questionsets[questionsetId].questions ) {
                        this.questionsArray[questionsetId].push( this.questionnaire.questionsets[questionsetId].questions[questionId] ); // Fill the array of questions (grouped by questionset id).
                        this.questionoptionsArray[questionId] = [];
                        if ( this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions ) {
                            for ( let optionId in this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions ) {
                                this.questionoptionsArray[questionId].push( this.questionnaire.questionsets[questionsetId].questions[questionId].questionoptions[optionId] ); // Fill the array of question options (grouped by question id).
                            }
                        }
                    }
                }
            }
        }
    }

    // Sort the questionsets - by position field or date_entered:
    public sortQuestionsets() {
        this.questionsetsArray.sort( ( a, b ) => {
            let dummy = a.position - b.position;
            if( dummy !== 0 ) return dummy;
            else {
                if( a.date_entered < b.date_entered ) return -1;
                if( a.date_entered > b.date_entered ) return 1;
                return 0;
            }
        } );
    }

    // Sort the questions - by position field or date_entered:
    public sortQuestions() {
        for ( let questionset of this.questionsetsArray ) {
            if ( questionset.shuffle == 1 ) {
                this.helper.shuffle( this.questionsArray[questionset.id] );
            } else {
                // Sort the questions by the field "position" (and date_entered) or shuffle them.
                this.questionsArray[questionset.id].sort( ( a, b ) => {
                    let dummy = a.position - b.position;
                    if( dummy !== 0 ) return dummy;
                    else {
                        if( a.date_entered < b.date_entered ) return -1;
                        if( a.date_entered > b.date_entered ) return 1;
                        return 0;
                    }
                } );
            }
        }
    }

    public sortQuestionoptions() {
        // Sort the question options - by position field. Only for questions with options (i.e. not for text questions):
        for ( let questionset of this.questionsetsArray ) {
            for ( let question of this.questionsArray[questionset.id] ) {
                if ( question.questiontype.match( /^binary|single|multi|rating$/ ) ) {
                    if ( question.parentQuestionset.shuffle == 1 ) {
                        this.helper.shuffle( this.questionoptionsArray[question.id] );
                    } else {
                        // Sort the questions by the field "position" (and date_entered) or shuffle them.
                        this.questionoptionsArray[question.id].sort( ( a, b ) => {
                            return a.position - b.position;
                        });
                    }
                } else {
                    // In case of question type "ratinggroup" the options of each question has to be assigned to the predefined options from the question set.
                    // In case of a rating question set: Get the answer options from the field "questiontypeparameter".
                    if ( question.questiontype === 'ratinggroup') {
                        for ( let question of this.questionsArray[questionset.id] ) {
                            let sortedOptions = [];
                            for ( let entry of questionset.questiontypeparameter.rating.entries ) {
                                let isOptionFound = false;
                                for ( let questionoption of this.questionoptionsArray[question.id] ) {
                                    if ( questionoption.questionset_type_parameter_id === entry.id ) {
                                        isOptionFound = true;
                                        sortedOptions.push( questionoption );
                                        break;
                                    }
                                }
                                if( !isOptionFound ) sortedOptions.push( {} );
                            }
                            this.questionoptionsArray[question.id] = sortedOptions;
                        }
                    }
                }
            }
        }
    }

    /**
     * Sort the questionnaire data got from the backend.
     */
    public sortData() {
        this.sortQuestionsets();
        this.sortQuestions();
        this.sortQuestionoptions();
    }

    public buildQuestionMetaData() {
        for ( let questionset of this.questionsetsArray ) {
            for( let question of this.questionsArray[questionset.id] ) {
                // if ( typeof question.questionparameter === 'undefined' ) question.questionparameter = {};
                this.questionsMeta[question.id] = {
                    readonly: false,
                    finished: false,
                    parameter: question.questionparameter
                };
            }
        }
    }

    /**
     *
     * @param questiontype
     * @private
     */
    public questiontypeWithOptions( questiontype: string ): boolean {
        return questiontype.match( /^binary|single|multi|ist|rating|ratinggroup$/ ) !== null;
    }

    /**
     *
     * @private
     */
    public initAnswers() {
        for ( let questionset of this.questionsetsArray ) {
            for ( let question of this.questionsArray[questionset.id] ) {
                if ( !this.answers[question.id] ) this.answers[question.id] = {};
                if ( this.questiontypeWithOptions( question.questiontype )) {
                    if ( this.answers[question.id].options === undefined ) this.answers[question.id].options = {};
                    for ( let option of this.questionoptionsArray[question.id] ) {
                        this.answers[question.id].options[option.id] = false;
                    }
                } else {
                    this.answers[question.id].answer_value = '';
                }
            }
        }
    }

    public loadParticipation_byParent(): Observable<any> {
        let responseSubject = new Subject<any>();
        this.backend.getRequest('module/QuestionAnswers/ofParticipation/byParent/'+this.parentType+'/'+this.parentId ).subscribe( response => {
            this.questionnaireId = response.questionnaireId;
            // In case the edit mode is "off" or "preview" there are no answer values to load:
            // if ( this.editMode === 'preview' || this.editMode === 'off' ) return;
            this.loadQuestionnaire().subscribe( () => {
                this.participationId = response.participationId;
                this.answersBackup = _.clone( response.answers ); // A clone of the answer data to keep the possibility to reset data.
                this.insertLoadedAnswers( response.answers );
                this.isCompleted = !!response.isCompleted;
                this.isLoadedParticipation = true;
                responseSubject.next();
                responseSubject.complete();
            });
        });
        return responseSubject;
    }

    public loadParticipation_byParticipation(): Observable<any> {
        let responseSubject = new Subject<any>();
        this.backend.getRequest('module/QuestionAnswers/ofParticipation/byParticipation/'+this.participationId ).subscribe( response => {
            this.questionnaireId = response.questionnaireId;
            this.loadQuestionnaire().subscribe( () => {
                this.insertLoadedAnswers( response.answers );
                this.isCompleted = !!response.isCompleted;
                this.isLoadedParticipation = true;
                responseSubject.next();
                responseSubject.complete();
            });
        });
        return responseSubject;
    }

    public insertLoadedAnswers( answers: any ): void {
        for ( let questionId in answers ) {
            if ( this.answers[questionId] === undefined ) this.answers[questionId] = {};
            if ( answers[questionId].answer_value !== undefined ) {
                this.answers[questionId].answer_value = answers[questionId].answer_value;
            } else if ( !_.isEmpty( answers[questionId].options )) {
                if ( this.answers[questionId].options === undefined ) this.answers[questionId].options = {};
                for ( let optionId in answers[questionId].options ) {
                    this.answers[questionId].options[optionId] = answers[questionId].options[optionId];
                }
            }
        }
        for ( let questionset of this.questionsetsArray ) {
            this.determineNumOfFinishedQuestionsInQuestionset( questionset.id );
        }
    }

    /**
     * Reload all the data of the questionnaire.
     */
    public reload() {
        this.isLoadedQuestionnaire = this.isLoadedParticipation = false;
        this.questionsetsArray.length = 0; // empties the array of question sets
        let key: string;
        for ( key in this.questionsArray ) delete this.questionsArray[key]; // empties the object of questions
        for ( key in this.questionoptionsArray ) delete this.questionoptionsArray[key]; // empties the object of question options
        for ( key in this.questionoptions ) delete this.questionoptions[key]; // empties the object of question options
        for ( key in this.questionnaire ) delete this.questionnaire[key]; // empties the object of question sets
        if ( this.initByParent ) this.loadParticipation_byParent();
        else if ( this.initByParticipation ) this.loadParticipation_byParticipation();
        else if ( this.initByQuestionnaire ) this.loadQuestionnaire();
    }

    /**
     * Determines the number of finished questions of a specific question set.
     * @param questionsetId ID of the question Set.
     */
    public determineNumOfFinishedQuestionsInQuestionset( questionsetId: string ): number {
        let numberFinishedQuestions = 0;
        let finished;
        for ( let question of this.questionsArray[questionsetId] ) {
            switch( question.questiontype ) {
                case 'text':
                case 'nps':
                    if ( this.answers[question.id].answer_value && this.answers[question.id].answer_value != '' ) {
                        this.questionsMeta[question.id].finished = true;
                        numberFinishedQuestions++;
                    } else this.questionsMeta[question.id].finished = false;
                    break;
                case 'binary':
                case 'single':
                case 'multi':
                    let numberSelectedOptions = 0;
                    finished = false;
                    for ( let optionId in this.answers[question.id].options ) {
                        if ( this.answers[question.id].options[optionId] === true ) {
                            numberSelectedOptions++;
                            if ( question.questiontype !== 'multi'
                                || ( !this.questionsMeta[question.id].parameter.minAnswers )
                                || ( numberSelectedOptions >= this.questionsMeta[question.id].parameter.minAnswers )) {
                                finished = true;
                                break;
                            }
                        }
                    }
                    if ( finished ) numberFinishedQuestions++;
                    this.questionsMeta[question.id].finished = finished;
                    break;
                case 'ist':
                    finished = true;
                    for ( let optionId in this.answers[question.id].options ) {
                        if ( this.answers[question.id].options[optionId] === false ) {
                            finished = false;
                            break;
                        }
                    }
                    this.questionsMeta[question.id].finished = finished;
                    if ( finished ) numberFinishedQuestions++;
                    break;
                case 'rating':
                case 'ratinggroup':
                    finished = false;
                    for ( let optionId in this.answers[question.id].options ) {
                        if ( this.answers[question.id].options[optionId] === true ) {
                            finished = true;
                            break;
                        }
                    }
                    this.questionsMeta[question.id].finished = finished;
                    if ( finished ) numberFinishedQuestions++;
                    break;
            }
        }
        this.numOfFinishedQuestionsInQuestionset[questionsetId] = numberFinishedQuestions;
        this.percentOfFinishedQuestionsInQuestionset[questionsetId] = numberFinishedQuestions/this.questionsArray[questionsetId].length*100;
        this.allQuestionsOfQuestionsetFinished[questionsetId] = ( numberFinishedQuestions === this.questionsArray[questionsetId].length );
        return numberFinishedQuestions;
    }

    /**
     * Saves all answers to the backend.
     * Emits true/false to report the success of saving.
     */
    public save( setCompleted = false ): EventEmitter<boolean> {
        this.isSaving = true;
        let finishedSaving$ = new EventEmitter<boolean>();
        this.backend.postRequest( this.routeForSave, {}, { setCompleted: setCompleted, questionnaireId: this.questionnaireId, answers: this.answers } ).subscribe( response => {
                this.isSaving = false;
                this.isDirty = false;
                this.isCompleted = !!response.isCompleted;
                if ( this.initByQuestionnaire ) this.participationId = response.questionnaireParticipationId;
                finishedSaving$.emit( true );
                this.broadcast.broadcastMessage('questionnaireParticipation.saved', { id: this.participationId, parentId: this.parentId, parentType: this.parentType });
            },
            error => {
                this.toast.sendToast('Error saving questionnaire answers.', 'error', null, false, 'errorSavingQuestionnaireAnswers');
                this.isSaving = false;
                finishedSaving$.emit( false );
            });
        return finishedSaving$;
    }

    /**
     * Get all the data of answers - to do something else with it.
     * An alternative to the method "save".
     */
    public getData() {
        return this.answers;
    }

    /**
     * Resets the data to its original state.
     */
    public reset() {
        this.answers = {};
        this.initAnswers();
        this.insertLoadedAnswers( this.answersBackup );
    }

}
