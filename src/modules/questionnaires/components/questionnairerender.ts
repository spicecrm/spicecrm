/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { BehaviorSubject } from 'rxjs';

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
export class QuestionnaireRender implements OnInit {

    /**
     * Either questionnaireId, parentId/parentType or participationId has to be set.
     */
    @Input() private questionnaireId: string;
    @Input() private parentId: string;
    @Input() private parentType: string;
    @Input() private participationId: string;

    @Input() private editMode: 'off'|'preview'|'questionnaire'|'questionoption' = 'questionnaire';

    @Output() private dirty = new EventEmitter(false);
    @Output() private loading = new BehaviorSubject(false);
    @Output() private saving = new BehaviorSubject(false);

    @Output() private questionnaireParticipation$ = new EventEmitter<questionnaireParticipationService>();
    private qp: questionnaireParticipationService;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.qp.showQuestionnaireTitle = false;
        if ( this.questionnaireId !== undefined && this.editMode === undefined ) this.editMode = 'preview';
        this.qp.editMode = this.editMode;
        if ( this.questionnaireId ) this.qp.init_byQuestionnaire( this.questionnaireId );
        else if ( this.participationId ) this.qp.init_byParticipation( this.participationId );
        else if ( this.parentId && this.parentType ) this.qp.init_byParent( this.parentId, this.parentType );
        this.questionnaireParticipation$.next( this.qp );
    }

    /*
    public reload(): void {
       // if ( !this.questionnaireParticipation.isLoading )
       this.qp.reloadQuestionnaire();
    }

    public save() {
        this.qp.save();
    }

     */

}
