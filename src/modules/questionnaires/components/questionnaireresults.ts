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

@Component({
    templateUrl: '../templates/questionnaireresults.html',
    providers: [questionnaireParticipationService]
})
export class QuestionnaireResults implements OnInit {

    public questionnaireParticipation: questionnaireParticipationService;

    constructor( public model: model, public metadata: metadata, public language: language, public backend: backend, public modal: modal, public injector: Injector, public broadcast: broadcast ) { }

    public ngOnInit() {
        this.broadcast.message$.subscribe(msg => {
            // Reload the questionnaire in case the participation/answers had been (re-)saved elsewhere:
            if ( msg.messagetype == 'questionnaireParticipation.saved' && msg.messagedata.parentType === this.model.module && msg.messagedata.parentId === this.model.id ) {
                this.questionnaireParticipation.reload();
            }
        });
    }

    /**
     * Is there a participation?
     * @private
     */
    public get noParticipation() {
        return this.questionnaireParticipation && this.questionnaireParticipation.isLoaded && !this.questionnaireParticipation.participationId;
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
        this.modal.openModal('QuestionnaireFillOutModal').subscribe(modal => {
            modal.instance.parentId = this.model.id;
            modal.instance.parentType = this.model.module;
        });
    }

    /**
     * In case we know it (parent ist ServiceFeedbacks): Is the Questionnaire completed (filled out)?
     * @private
     */
    public get questionnaireIsCompleted(): boolean {
        return this.model.module === 'ServiceFeedbacks' && this.model.getField('servicefeedback_status') === 'completed';
    }

}
