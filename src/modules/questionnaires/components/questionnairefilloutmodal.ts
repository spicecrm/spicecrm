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
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { modal } from '../../../services/modal.service';
import { language } from '../../../services/language.service';
import { Subscription } from 'rxjs';

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

    private qpIsDirty: boolean;
    private qpIsSaving: boolean;
    private qpIsLoaded: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor( private modal: modal, private language: language ) { }

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
        if ( this.qpIsSaving ) return;
        this.subscriptions.add(
            this.qp.save( setCompleted ).subscribe( success => {
                if ( success ) this.self.destroy();
            })
        );
    }

    /**
     * This function is called by the modal service when the ESC key has been pressed.
     * The function grants permission to close the window. Or not.
     * Depending on whether the questionnaire is dirty and - if so - the user agrees to discard the changes or not.
     */
    private onModalEscX(): boolean {
        if ( this.qpIsSaving ) return; // Closing is not possible during the saving process.
        if ( this.qpIsDirty ) {
            this.subscriptions.add(
                this.modal.confirm( this.language.getLabel('Discard changes?')).subscribe(answer => {
                    if ( answer ) this.self.destroy();
                })
            );
            return false;
        } else return true;
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
