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
    templateUrl: './src/modules/questionnaires/templates/questionnaireresults.html',
    providers: [questionnaireParticipationService]
})
export class QuestionnaireResults implements OnInit {

    private questionnaireParticipation: questionnaireParticipationService;

    constructor( private model: model, private metadata: metadata, private language: language, private backend: backend, private modal: modal, private injector: Injector, private broadcast: broadcast ) { }

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
    private get noParticipation() {
        return this.questionnaireParticipation && this.questionnaireParticipation.isLoaded && !this.questionnaireParticipation.participationId;
    }

    /**
     * Reload the rendered questionnaire.
     * @private
     */
    private reload(): void {
        this.questionnaireParticipation.reload();
    }

    /**
     * Open the modal to fill out the questionnaire.
     * @private
     */
    private fillOut(): void {
        this.modal.openModal('QuestionnaireFillOutModal').subscribe(modal => {
            modal.instance.parentId = this.model.id;
            modal.instance.parentType = this.model.module;
        });
    }

    /**
     * In case we know it (parent ist ServiceFeedbacks): Is the Questionnaire completed (filled out)?
     * @private
     */
    private get questionnaireIsCompleted(): boolean {
        return this.model.module === 'ServiceFeedbacks' && this.model.getField('servicefeedback_status') === 'completed';
    }

}
