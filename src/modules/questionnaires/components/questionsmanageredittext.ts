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
import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';

@Component({
    selector: 'questions-manager-edit-text',
    templateUrl: './src/modules/questionnaires/templates/questionsmanageredittext.html'
})
export class QuestionsManagerEditText extends QuestionsManagerEditBasic implements OnInit {

    private answer: any = {}; // No array, only one element (a text answer)

    /**
     * Getter for the sequenced flag, stored in the question parameters.
     */
    public get sequenced(): boolean {
        return !!this.questionparameters.sequenced;
    }

    /**
     * Setter for the sequenced flag, stored in the question parameters.
     */
    public set sequenced( value: boolean ) {
        this.questionparameters.sequenced = value;
        this.writeQuestionparametersToModel();
    }

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the property "sequenced", if not yet existing in the question parameter object.
        // "sequenced" is specific for questions of type "text".
        if ( this.questionparameters.sequenced === undefined ) this.sequenced = false;

        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = { beans: {} };
        }
        for ( let i in this.model.data.questionoptions.beans ) {
            this.answer = this.model.data.questionoptions.beans[i];
            break;
        }
        if ( Object.keys( this.answer ).length === 0 ) {
            let newOptionId: string = this.model.generateGuid();
            this.answer = this.model.data.questionoptions.beans[newOptionId] = {
                id: newOptionId,
                question_id: this.model.id,
                name: '',
                categories: '',
                points: ''
            };
        }
    }

}
