/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    public ngOnChanges() {
        this.qp.editMode = this.editMode;
    }

}
