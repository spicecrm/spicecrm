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
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: '[questions-manager-edit-option-single-multi]',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditoptionsinglemulti.html',
    providers: [model,view]
})
export class QuestionsManagerEditOptionSingleMulti implements OnInit {

    @Input() public categorypool;
    @Output() public event: EventEmitter<any> = new EventEmitter<any>();
    @Input() public option: any;
    @Input() public isFirstRow: boolean;
    @Input() public isLastRow: boolean;
    @Input() public hasInfosCorrectness: boolean;
    @Output() public isDirty: boolean;

    constructor( private language: language, private metadata: metadata, private model: model, private view: view, private modalservice: modal ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        this.model.module = 'QuestionOptions';
        this.model.id = this.option.id;
        this.model.data = this.option;
    }

    private deleteOption(): void {
        this.modalservice.confirm( this.language.getLabelFormatted('QST_DELETE_ANSWER_OPTION_LONG', this.option.name ),
            this.language.getLabel('QST_DELETE_ANSWER_OPTION')).subscribe( answer => {
                if ( answer ) this.event.emit( 'delete');
            });
    }

    /**
     * Handler if the checkbox "is_correct_option" got changed.
     * @param event Event
     */
    private onChange_isCorrectOption( event ): void {
        this.option.is_correct_option = event.target.checked;
    }

    private optionUp(): void {
        this.event.emit('up');
    }
    private optionDown(): void {
        this.event.emit( 'down');
    }

}
