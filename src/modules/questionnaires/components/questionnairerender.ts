/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
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
export class QuestionnaireRender implements OnInit, OnDestroy, OnChanges {

    /**
     * Either questionnaireId, parentId/parentType or participationId has to be set.
     */
    @Input() private questionnaireId: string;
    @Input() private parentId: string;
    @Input() private parentType: string;
    @Input() private participationId: string;

    @Input() private editMode: 'off'|'preview'|'postview'|'questionnaire'|'questionoption' = 'questionnaire';

    @Input() private showQuestionnaireTitle = true;
    @Input() private showQuestionnaireTextBefore = true;
    @Input() private showQuestionnaireTextAfter = true;
    @Input() private showProgress = false;
    @Input() private hideFinishedQuestions = false;
    @Input() private inModal = true;
    @Input() private imageWidthQuestion = 200;
    @Input() private imageWidthOption = 200;

    @Output() private isDirty$ = new BehaviorSubject( false );
    @Output() private isSaving$ = new BehaviorSubject( false );
    @Output() private isLoaded$ = new BehaviorSubject( false );

    @Output() private questionnaireParticipation$ = new EventEmitter<questionnaireParticipationService>();
    private qp: questionnaireParticipationService;

    private subscriptions: Subscription = new Subscription();

    @Output() private answersChanged$ = new EventEmitter();

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
        this.qp.answersChanged$.subscribe( () => this.answersChanged$.emit() );
    }

    public ngOnInit() {
        this.qp.editMode = this.editMode;
        this.qp.inModal = this.inModal;
        if ( this.participationId ) this.qp.init_byParticipation( this.participationId );
        else if ( this.parentId && this.parentType ) this.qp.init_byParent( this.parentId, this.parentType );
        else if ( this.questionnaireId ) this.qp.init_byQuestionnaire( this.questionnaireId );
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

    /**
     * Is the questionnaire to be displayed or not?
     * @private
     */
    private questionnaireIsToBeDisplayed(): boolean {
        if ( this.qp.isLoaded ) {
            if ( this.qp.participationId ) return true;
            if ( this.qp.questionnaireId && this.qp.editMode !== 'postview') return true; // this.qp.editMode !== 'off' &&
        }
        return false;
    }

    public reload(): void {
        if ( this.qp ) this.qp.reload();
    }

    public save() {
        if ( this.qp ) this.qp.save();
    }

    /**
     * unsubscribe from subscriptions and destroy
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public ngOnChanges() {
        this.qp.editMode = this.editMode;
    }

}
