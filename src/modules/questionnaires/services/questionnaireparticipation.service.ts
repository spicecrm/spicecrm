/**
 * @module ModuleQuestionnaires
 */

import { ChangeDetectorRef, EventEmitter, Injectable, Input, OnDestroy } from '@angular/core';

import {backend} from '../../../services/backend.service';

/*
import {of, Subject, Subscription} from 'rxjs';

import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {broadcast} from "../../../services/broadcast.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {map, take} from "rxjs/operators";
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
*/

/**
 * @ignore
 */
/*
declare var moment: any;
*/

/**
 * @ignore
 */
/*
declare var _: any;
*/

/**
 * Handle loading events from backend, manage other calendars, holds some default necessary values for calendar sheets and subscribe to handle model changes.
 */
@Injectable()
export class questionnaireParticipationService {

    public questionsets: any[] = [];
    public questionnaire: any;

    public participationId: string;

    /*
    private _noEdit = false;
    private _preview = false;
    private _bulk = true;
     */

    public inModal = true;
    public showQuestionnaireTitle = true;

    public timerText: string = null;
    public timerWarning = false;

    public hideFinishedQuestions = false;

    public editMode: 'off'|'preview'|'questionnaire'|'questionoption' = 'questionnaire';

    private isLoadingQuestionnaire = false;
    private isLoadingQuestionsets = false;
    private isLoadingParticipation = false;

    public get isLoading() {
        return this.isLoadingQuestionnaire && this.isLoadingQuestionsets && this.isLoadingParticipation;
    }

    public initByParent( parentType: string, parentId: string ) {

    }

    public initByParticipation( participationId: string ) {

    }

    public initByQuestionnaire( questionnaire: any ) {
        this.questionnaire = questionnaire;
    }

    // /QuestionnaireParticipation/ID/start


    public setEditMode( editMode: 'off'|'preview'|'questionnaire'|'questionoption' ) {
        this.editMode = editMode;
        return this;
    }

    // let asdf = new QuestionaireParticipation->setEditMode('questionnaire')->setId()->init();

    constructor( private backend: backend ) {

    }

    public setAnswerValue( questionId: string, value: any ) {
        if ( this.editMode === 'off' || this.editMode === 'preview' ) return;
        this.answers[questionId].value = value;
    }

    public setAnswerOption( optionId: string, onOff = true ) {
        let question = this.options[optionId].question;
        if ( this.editMode === 'off' || this.editMode === 'preview' ) return;

    }

    // public options: any {

    /// }

    public setTimer( text: string, warning: boolean ) {

}

    private loadQuestionnaire( questionnaireId ) {

    }

    private loadOrCreateParticipation( id: string = null, parentType: string = null ) {
        if ( !parentType ) {

        }
    }

    private loadParticipation( id: string, parentType: string ) {

    }

    private loadQuestionsets() {
        this.backend.getRequest('module/Questionnaires/'+this.questionnaire.id+'/related/questionsets', {limit: 999}).subscribe( questionsets => {
            for( let key of Object.keys( questionsets ) ) this.questionsets.push( questionsets[key] );
            this.questionsets.sort( ( a, b ) => {
                return a.position - b.position;
            });
        });
        this.isLoading = false;
    }

    public reloadQuestionsets() {
        this.loadQuestionsets();
    }

}
