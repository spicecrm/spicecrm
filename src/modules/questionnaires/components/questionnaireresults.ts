/**
 * @module ModuleQuestionnaires
 */
import { Component, Injector, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { metadata } from '../../../services/metadata.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import { modal } from '../../../services/modal.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { broadcast } from '../../../services/broadcast.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: '../templates/questionnaireresults.html'
})
export class QuestionnaireResults implements OnInit {

    /**
     * Is this component right now used for a QuestionnaireParticipation (or for a ServiceFeedback))?
     */
    public isForParticipation: boolean;

    public questionnaireParticipation: questionnaireParticipationService;

    public subscription: Subscription;

    constructor( public model: model, public metadata: metadata, public language: language, public backend: backend, public modal: modal, public injector: Injector, public broadcast: broadcast ) { }

    public ngOnInit() {
        this.isForParticipation = ( this.model.module === 'QuestionnaireParticipations' );
        this.subscription = this.broadcast.message$.subscribe(msg => {
            // In case the participation/answers had been (re-)saved elsewhere
            // • Reload the questionnaire.
            // • Reload the detail view in case the status/completed field has changed.
            if ( msg.messagetype == 'questionnaireParticipation.filledIn' ) {
                if ( this.isForParticipation && msg.messagedata.id === this.questionnaireParticipation.participationId ) {
                    this.questionnaireParticipation.isLoaded$.subscribe( () => {
                        if ( this.questionnaireParticipation.isCompleted && this.model.getField('completed') !== true && !this.model.isEditing ) this.model.getData( true, null, true );
                    });
                    this.questionnaireParticipation?.reload();
                } else if ( msg.messagedata.parentType === 'ServiceFeedbacks' && msg.messagedata.parentId === this.model.id ) {
                    if ( this.model.getField('servicefeedback_status') !== 'completed' && !this.model.isEditing ) this.model.getData( true, null, true );
                    this.questionnaireParticipation?.reload();
                }
            }
        });
    }

    /**
     * Is there a participation?
     * @private
     */
    public get participationExists() {
        if ( this.questionnaireParticipation?.isLoaded ) {
            if ( this.questionnaireParticipation.participationId ) return true;
            else return false;
        } else return undefined;
    }

    /**
     * Reload the rendered questionnaire.
     * @private
     */
    public reload(): void {
        this.questionnaireParticipation.reload();
    }

    /**
     * Open the modal to fill out the questionnaire.
     * @private
     */
    public fillOut(): void {
        this.modal.openModal('QuestionnaireFillOutModal')
            .pipe(take(1))
            .subscribe(modal => {
                if ( this.isForParticipation ) {
                    modal.instance.participationId = this.model.id;
                } else {
                    modal.instance.parentId = this.model.id;
                    modal.instance.parentType = this.model.module;
                }
            });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
