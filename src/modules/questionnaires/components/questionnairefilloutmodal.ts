/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { modal } from '../../../services/modal.service';
import { language } from '../../../services/language.service';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { view } from '../../../services/view.service';
import { take } from 'rxjs/operators';
import { backend } from '../../../services/backend.service';

@Component({
    selector: 'questionnaire-fill-out-modal',
    templateUrl: './src/modules/questionnaires/templates/questionnairefilloutmodal.html',
    providers: [model, view]
})
export class QuestionnaireFillOutModal implements OnInit {

    @Input() public questionnaireId: string;
    @Input() public parentId: string;
    @Input() public parentType: string;
    @Input() public participationId: string;
    @Input() public saved$: EventEmitter<boolean> = new EventEmitter();

    private self: any;

    private questionnaireParticipation: questionnaireParticipationService;
    private qp: questionnaireParticipationService; // shortcut

    private qpIsDirty: boolean;
    private qpIsSaving: boolean;
    private qpIsLoaded: boolean;

    private componentconfig: any;

    private offeredQuestionnaires = [];

    private get isAnonymous(): boolean {
        return ( this.parentId === undefined || this.parentType === undefined ) && this.participationId === undefined;
    }

    private idSelectedQuestionnaire: string;

    private awaitingEnd = false;

    constructor( private modal: modal, private language: language, private metadata: metadata, private model: model, private view: view, private backend: backend ) { }

    public ngOnInit(): void {
        if ( this.isAnonymous && !this.questionnaireId ) this.loadQuestionnairesList();
        this.qp = this.questionnaireParticipation; // qp as shortcut
        this.model.module = 'QuestionnaireParticipations';
        this.view.isEditable = true;
        this.model.isEditing = true;
        this.view.setEditMode();
        this.componentconfig = this.metadata.getComponentConfig('QuestionnaireFillOutModal');
    }

    /**
     * Load a list of all questionnaires - to offer them for selection.
     */
    private loadQuestionnairesList() {
        this.backend.getRequest('module/Questionnaires', { limit: '-99'})
            .pipe(take(1))
            .subscribe( resp => {
                this.language.sortObjects( resp.list, 'name');
                this.offeredQuestionnaires = resp.list;
            });
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
     *  Then save the extra fields of the participation, in case there are any.
     */
    private saveAndClose( setCompleted: boolean ) {
        if ( this.qpIsSaving ) return;
        this.awaitingEnd = true;
        this.qp.save( setCompleted )
            .pipe(take(1))
            .subscribe( success => {
                if ( success ) {
                    if ( this.componentconfig.componentsetSpecialFields ) {
                        this.model.id = this.qp.participationId;
                        this.model.save()
                            .pipe( take( 1 ) )
                            .subscribe( saved => {
                                this.saved$.emit( setCompleted );
                                this.self.destroy();
                            });
                    } else {
                        this.saved$.emit( setCompleted );
                        this.self.destroy();
                    }
                }
            });
    }

    /**
     * This function is called by the modal service when the ESC key has been pressed.
     * The function grants permission to close the window. Or not.
     * Depending on whether the questionnaire is dirty and - if so - the user agrees to discard the changes or not.
     */
    private onModalEscX(): boolean {
        if ( this.qpIsSaving ) return; // Closing is not possible during the saving process.
        if ( this.qpIsDirty ) {
            this.modal.confirm( this.language.getLabel('Discard changes?'))
                .pipe(take(1))
                .subscribe(answer => {
                    if ( answer ) this.self.destroy();
                });
        } else this.self.destroy();
    }

}
