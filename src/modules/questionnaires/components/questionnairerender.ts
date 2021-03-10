/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'questionnaire-render',
    templateUrl: './src/modules/questionnaires/templates/questionnairerender.html',
    styles: [
        '::ng-deep .questionnaire-some-words p { margin: 0.5rem 0; }',
        '::ng-deep .questionnaire-some-words p:first-child { margin-top: 0; }',
        '::ng-deep .questionnaire-some-words p:last-child { margin-bottom: 0; }'
    ],
    providers: [questionnaireParticipationService]
})
export class QuestionnaireRender implements OnInit, OnDestroy {

    /**
     * Either questionnaireId, parentId/parentType or participationId has to be set.
     */
    @Input() private questionnaireId: string;
    @Input() private parentId: string;
    @Input() private parentType: string;
    @Input() private participationId: string;

    @Input() private editMode: 'off'|'preview'|'questionnaire'|'questionoption' = 'questionnaire';

    @Input() private showQuestionnaireTitle = true;
    @Input() private showQuestionnaireTextBefore = true;
    @Input() private showQuestionnaireTextAfter = true;
    @Input() private inModal = true;

    @Output() private isDirty$ = new BehaviorSubject( false );
    @Output() private isSaving$ = new BehaviorSubject( false );
    @Output() private isLoaded$ = new BehaviorSubject( false );

    @Output() private questionnaireParticipation$ = new EventEmitter<questionnaireParticipationService>();
    private qp: questionnaireParticipationService;

    private subscriptions: Subscription = new Subscription();

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.qp.editMode = this.editMode;
        this.qp.inModal = this.inModal;
        if ( this.questionnaireId ) this.qp.init_byQuestionnaire( this.questionnaireId );
        else if ( this.participationId ) this.qp.init_byParticipation( this.participationId );
        else if ( this.parentId && this.parentType ) this.qp.init_byParent( this.parentId, this.parentType );
        this.questionnaireParticipation$.next( this.qp );
        this.subscriptions.add(
            this.qp.isLoaded$.subscribe( isLoaded => this.isLoaded$.next( isLoaded ))
        );
        this.subscriptions.add(
            this.qp.isSaving$.subscribe( isSaving => this.isSaving$.next( isSaving ))
        );
        this.subscriptions.add(
            this.qp.isDirty$.subscribe( isDirty => this.isDirty$.next( isDirty ))
        );
    }

    public reload(): void {
       if ( this.qp ) this.qp.reload();
    }

    public save() {
        if ( this.qp ) this.qp.save();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
