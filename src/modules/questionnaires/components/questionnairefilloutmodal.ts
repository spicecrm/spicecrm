/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionnaire-fill-out-modal',
    templateUrl: './src/modules/questionnaires/templates/questionnairefilloutmodal.html'
})
export class QuestionnaireFillOutModal implements OnInit {

    @Input() public questionnaireId: string;
    @Input() public parentId: string;
    @Input() public parentType: string;

    private self: any;

    private questionnaireParticipation: questionnaireParticipationService;
    private qp: questionnaireParticipationService;

    private get qpIsSaving(): boolean {
        return this.qp && this.qp.isSaving;
    }

    private get qpIsDirty(): boolean {
        return this.qp && this.qp.isDirty;
    }

    // constructor() { }

    public ngOnInit(): void {
        this.qp = this.questionnaireParticipation;
    }

    // Close the modal.
    private cancel() {
        if ( this.qpIsSaving ) return;
        this.self.destroy();
    }

    // Save the current questionnaire answers.
    private save() {
        this.qp.save();
    }

    private onModalEscX(): boolean {
        return true;
    }

}
