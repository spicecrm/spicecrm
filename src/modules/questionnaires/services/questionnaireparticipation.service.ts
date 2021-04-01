/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleQuestionnaires
 */

import { EventEmitter, Injectable } from '@angular/core';
import { backend } from '../../../services/backend.service';
import { toast } from "../../../services/toast.service";
import { language } from '../../../services/language.service';
import { helper } from '../../../services/helper.service';
import { BehaviorSubject } from 'rxjs';
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

    public hideFinishedQuestions = false;

    public editMode: 'off'|'preview'|'questionnaire'|'questionoption' = 'questionnaire';

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

    private initByParent = false;
    private initByParticipation = false;
    private initByQuestionnaire = false;

    /**
     * isDirty indicates that one or more question answers has been given/changed and that the information is still not saved to the backend.
     */
    private _isDirty = false;
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
    private _isLoadedQuestionnaire = false;
    private _isLoadedParticipation = false;
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
    private _isSaving = false;
    public get isSaving(): boolean {
        return this._isSaving;
    }
    public set isSaving( value ) {
        this._isSaving = value;
        this.isSaving$.next( value );
    }
    public isSaving$ = new BehaviorSubject( false );

    public answersChanged$ = new EventEmitter();

    constructor( private backend: backend, private toast: toast, private language: language, private helper: helper, private broadcast: broadcast ) { }

    public init_byParent( parentId: string, parentType: string ): void {
        this.initByParent = true;
        this.parentId = parentId;
        this.parentType = parentType;
        this.loadParticipation_byParent();
    }

    public init_byParticipation( participationId: string ) {
        this.initByParticipation = true;
        this.participationId = participationId;
        this.loadParticipation_byParticipation();
    }

    public init_byQuestionnaire( questionnaireId: string ) {
        this.initByQuestionnaire = true;
        this.questionnaireId = questionnaireId;
        if ( !this.editMode ) this.editMode = 'preview';
        this.loadQuestionnaire();
    }

    /**
     * An answer value was entered.
     */
    public setAnswerValue( questionId: string, value: string ): boolean {

        // If the edit mode is 'off', a input/change is not allowed and is not to be treated. --> Do nothing and return false.
        if ( this.editMode === 'off' ) return false;

        // Is the input field of the question currently disabled? --> Do nothing and return.
        // Info: While waiting for the response of the server the input field is disabled.
        if ( this.questionsMeta[questionId].tempReadonly ) return false;

        let backupForNetworkError;
        if ( this.editMode === 'questionoption' ) {
            backupForNetworkError = JSON.stringify( this.answers[questionId] );
        }
        this.answers[questionId].optionlessAnswerValue = value;
        if ( this.editMode === 'questionoption' ) this.saveSingleAnswerToBackend( questionId, backupForNetworkError );
        else this.isDirty = true;

    }

    /**
     * An option with value was entered (questiontype "ist").
     */
    public setOptionWithValue( optionId: string, value: string ): boolean {

        let question = this.questionoptions[optionId].parentQuestion;

        // If the edit mode is 'off', a input/change is not allowed. --> Do nothing and return false.
        if ( this.editMode === 'off' ) return false;

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
        /*
        this.backend.postRequest( 'module/Questions/' + questionId + '/answervalues/' + this.participationId, {},
            { optionlessAnswerValue: this.answers[questionId].optionlessAnswerValue } ).subscribe(
            data => {
                this.answers[questionId].optionlessAnswerValue = data.optionlessAnswerValue; // Relevant is, what´s in the database/backend.
                this.questionsMeta[questionId].tempReadonly = false; // Enable the input field of the question.
                this.determineNumOfFinishedQuestionsInQuestionset( this.questions[questionId].questionset_id ); // New determination of the number of finished questions.
            },
            error => {
                this.questionsMeta[questionId].tempReadonly = false; // Enable the input field of the question.
                this.toast.sendToast( this.language.getLabel( 'ERR_NETWORK_SAVING' ), 'error', error.message, false ); // Error toast for the user.
                this.answers[questionId] = JSON.parse( backupForNetworkError ); // Restore old question answer.
            }
        );

         */
    }

    /**
     * Determine the number of currently selected answer options (checkboxes).
     */
    private numOptionsSelected( questionId: string ): number {
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

        // If the edit mode is 'off', a input/change is not allowed. --> Do nothing and return false.
        if ( this.editMode === 'off' ) return false;

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

    // toDo, to complete
    public setTimer( text: string, warning: boolean ) {
        1;
    }

    /**
     * Load the questionnaire (with question sets, questions and question options)
     * and do all the other stuff like building arrays, sorting, building of question meta data and initializing the answers object.
     */
    private loadQuestionnaire(): EventEmitter<any> {
        this.isLoadedParticipation = true; // Only in case there was no participation to load.
        let loaded$ = new EventEmitter<any>();
        this.backend.getRequest( 'questionnaire/render/'+this.questionnaireId ).subscribe( ( response: any ) => {
            this.questionnaire = response;
            this.doBasics();
            this.buildArrays();
            this.sortData();
            this.buildQuestionMetaData();
            this.initAnswers();
            for ( let questionset of this.questionsetsArray ) {
                this.determineNumOfFinishedQuestionsInQuestionset( questionset.id );
            }
            this.isLoadedQuestionnaire = true;
            loaded$.emit();
        });
        return loaded$;
    }

    /**
     * Do some basic stuff:
     * Set IDs of parents. And: Create object "questionoptions".
     */
    private doBasics() {
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
    private buildArrays() {
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
    private sortQuestionsets() {
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
    private sortQuestions() {
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

    private sortQuestionoptions() {
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
                    if ( question.questiontype === 'ratinggroup' && question.questionparameter.ratinggroup ) {
                        for ( let question of this.questionsArray[questionset.id] ) {
                            let sortedOptions = [];
                            for ( let entry of question.questionparameter.ratinggroup.entries ) {
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
                            this.questionoptions[question.id] = sortedOptions;
                        }
                    }
                }
            }
        }
    }

    /**
     * Sort the questionnaire data got from the backend.
     */
    private sortData() {
        this.sortQuestionsets();
        this.sortQuestions();
        this.sortQuestionoptions();
    }

    private buildQuestionMetaData() {
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
    private questiontypeWithOptions( questiontype: string ): boolean {
        return questiontype.match( /^binary|single|multi|ist|rating|ratinggroup$/ ) !== null;
    }

    /**
     *
     * @private
     */
    private initAnswers() {
        for ( let questionset of this.questionsetsArray ) {
            for ( let question of this.questionsArray[questionset.id] ) {
                if ( !this.answers[question.id] ) this.answers[question.id] = {};
                if ( this.questiontypeWithOptions( question.questiontype )) {
                    if ( this.answers[question.id].options === undefined ) this.answers[question.id].options = {};
                    for ( let option of this.questionoptionsArray[question.id] ) {
                        this.answers[question.id].options[option.id] = false;
                    }
                } else {
                    this.answers[question.id].optionlessAnswerValue = '';
                }
            }
        }
    }

    private loadParticipation_byParent() {
        this.backend.getRequest('QuestionAnswers/ofParticipation/byParent/'+this.parentType+'/'+this.parentId ).subscribe( response => {
            this.questionnaireId = response.questionnaireId;
            // In case the edit mode is "off" or "preview" there are no answer values to load:
            // if ( this.editMode === 'preview' || this.editMode === 'off' ) return;
            this.loadQuestionnaire().subscribe( () => {
                this.participationId = response.participationId;
                this.answersBackup = _.clone( response.answers ); // A clone of the answer data to keep the possibility to reset data.
                this.insertLoadedAnswers( response.answers );
                this.isCompleted = !!response.isCompleted;
                this.isLoadedParticipation = true;
            });
        });
    }

    private loadParticipation_byParticipation() {
        this.backend.getRequest('QuestionAnswers/ofParticipation/byParticipation/'+this.participationId ).subscribe( response => {
            this.questionnaireId = response.questionnaireId;
            this.loadQuestionnaire().subscribe( () => {
                this.insertLoadedAnswers( response.answers );
                this.isCompleted = !!response.isCompleted;
                this.isLoadedParticipation = true;
            });
        });
    }

    private insertLoadedAnswers( answers: any ): void {
        for ( let questionId in answers ) {
            if ( this.answers[questionId] === undefined ) this.answers[questionId] = {};
            if ( answers[questionId].optionlessAnswerValue !== undefined ) {
                this.answers[questionId].optionlessAnswerValue = answers[questionId].optionlessAnswerValue;
            } else if ( !_.isEmpty( answers[questionId].options )) {
                if ( this.answers[questionId].options === undefined ) this.answers[questionId].options = {};
                for ( let optionId in answers[questionId].options ) {
                    this.answers[questionId].options[optionId] = answers[questionId].options[optionId];
                }
            }
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

    // todo: check betreffend answer object
    private determineNumOfFinishedQuestionsInQuestionset( questionsetId: string ): number {
        return 0;
        let numberFinishedQuestions = 0;
        for ( let question of this.questionsArray[questionsetId] ) {
            switch( question.questiontype ) {
                case 'text':
                    if ( this.answers[question.id].length && this.answers[question.id].optionlessAnswerValue && this.answers[question.id].optionlessAnswerValue != '' ) {
                        this.questionsMeta[question.id].finished = true;
                        numberFinishedQuestions++;
                    } else this.questionsMeta[question.id].finished = false;
                    break;
                case 'nps':
                    for ( let answer of this.answers[question.id] ) {
                        if ( answer.value ) {
                            this.questionsMeta[question.id].finished = true;
                            numberFinishedQuestions++;
                            continue;
                        }
                    }
                case 'binary':
                case 'single':
                case 'multi':
                    let numberAnswers = 0;
                    let answeredOK = false;
                    for ( let answer of this.answers[question.id] ) {
                        if ( answer.value ) {
                            numberAnswers++;
                            if ( question.questiontype !== 'multi'
                                || ( question.questiontype === 'multi' && !this.questionsMeta[question.id].parameter.minAnswers )
                                || ( numberAnswers >= this.questionsMeta[question.id].parameter.minAnswers )) {
                                answeredOK = true;
                                this.questionsMeta[question.id].finished = true;
                                continue;
                            }
                        }
                    }
                    if ( answeredOK ) numberFinishedQuestions++;
                    break;
                case 'ist':
                    let unFinished = false;
                    for ( let answer of this.answers[question.id] ) {
                        if ( answer.value === false ) {
                            unFinished = true;
                            break;
                        }
                    }
                    if ( !unFinished ) {
                        numberFinishedQuestions++;
                        this.questionsMeta[question.id].finished = true;
                    }
                    break;
                case 'rating':
                    for( let answer of this.answers[question.id] ) {
                        if( answer.value ) {
                            this.questionsMeta[question.id].finished = true;
                            numberFinishedQuestions++;
                            continue;
                        }
                    }
                    break;
            }

            if( this.answers[question.id].length && this.answers[question.id].optionlessAnswerValue && this.answers[question.id].optionlessAnswerValue != '' ) {
                this.questionsMeta[question.id].finished = true;
                numberFinishedQuestions++;
            } else this.questionsMeta[question.id].finished = false;
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
        let route = 'QuestionAnswers/ofParticipation/';
        // if ( this.participationId ) route += 'byParticipation/'+this.participationId;
        // else
        route += 'byParent/'+this.parentType+'/'+this.parentId;
        let finishedSaving$ = new EventEmitter<boolean>();
        this.backend.postRequest( route, {}, { setCompleted: setCompleted, answers: this.answers } ).subscribe( response => {
                this.isSaving = false;
                this.isDirty = false;
                this.isCompleted = !!response.isCompleted;
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
