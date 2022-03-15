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
    templateUrl: '../templates/questionnairefilloutmodal.html',
    providers: [model, view]
})
export class QuestionnaireFillOutModal implements OnInit {

    @Input() public questionnaireId: string;
    @Input() public parentId: string;
    @Input() public parentType: string;
    @Input() public participationId: string;
    @Input() public saved$: EventEmitter<boolean> = new EventEmitter();

    public self: any;

    public questionnaireParticipation: questionnaireParticipationService;
    public qp: questionnaireParticipationService; // shortcut

    public qpIsDirty: boolean;
    public qpIsSaving: boolean;
    public qpIsLoaded: boolean;

    public componentconfig: any;

    public offeredQuestionnaires = [];

    public get isAnonymous(): boolean {
        return ( this.parentId === undefined || this.parentType === undefined ) && this.participationId === undefined;
    }

    public idSelectedQuestionnaire: string;

    public awaitingEnd = false;

    constructor( public modal: modal, public language: language, public metadata: metadata, public model: model, public view: view, public backend: backend ) { }

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
    public loadQuestionnairesList() {
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
    public cancel() {
        if ( this.qpIsSaving ) return;
        this.self.destroy();
    }

    /**
     *  Save the current questionnaire answers. The whole questionnaire.
     *  Then save the extra fields of the participation, in case there are any.
     */
    public saveAndClose( setCompleted: boolean ) {
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
    public onModalEscX(): boolean {
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
