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
            if ( msg.messagetype == 'questionnaireParticipation.saved' && msg.messagedata.parentType === this.model.module && msg.messagedata.parentId === this.model.id ) {
                this.questionnaireParticipation.reload();
            }
        });
    }

    private get noParticipation() {
        return this.questionnaireParticipation && this.questionnaireParticipation.isLoaded && !this.questionnaireParticipation.participationId;
    }

    /*
    private reload(): void {
        this.isLoading = true;
        this.noParticipation = false;
        // this.loadQuestionSetsWithResults();
    }
    */

    /*
    private fillOut() {
        this.modal.openModal('QuestionnaireFillOut', true, this.injector );
    }
     */



}
