/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { modal } from '../../../services/modal.service';
import { language } from '../../../services/language.service';

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

    constructor( private modal: modal, private language: language ) {}

    public ngOnInit(): void {
        this.qp = this.questionnaireParticipation;
    }

    /**
     * Cancel and close the modal window.
     */
    private cancel() {
        if ( this.qpIsSaving ) return;
        this.self.destroy();
    }

    /**
     *  Save the current questionnaire answers. The whole questionnaire.
     */
    private saveAndClose( setCompleted: boolean ) {
        this.qp.save( setCompleted ).subscribe( success => {
            if ( success ) this.self.destroy();
        });
    }

    /**
     * This function is called by the modal service when the ESC key has been pressed.
     * The function grants permission to close the window. Or not.
     * Depending on whether the questionnaire is dirty and - if so - the user agrees to discard the changes or not.
     */
    private onModalEscX(): boolean {
        if ( this.qpIsSaving ) return; // Closing is not possible during the saving process.
        if ( this.qp.isDirty ) {
            this.modal.confirm( this.language.getLabel('Discard changes?')).subscribe(answer => {
                if ( answer ) this.self.destroy();
            });
            return false;
        } else return true;
    }

}
