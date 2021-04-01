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
    selector: 'questions-manager-edit-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditnps.html'
})
export class QuestionsManagerEditNPS extends QuestionsManagerEditBasic implements OnInit {

    // The object "forCategories" is a workaround,
    // because the component QuestionsManagerEditCategories wants a object/bean of module QuestionOptions (with field "categories").
    private forCategories = { categories: '' };

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the properties "textForScore0" and "textForScore10", if not yet existing in the question parameter object.
        // "textForScore0" and "textForScore10" are specific for questions of type "nps".
        if ( typeof this.questionparameters.textForScore0 === 'undefined' ) {
            this.questionparameters.textForScore0 = '';
            this.writeQuestionparametersToModel();
        }
        if ( typeof this.questionparameters.textForScore10 === 'undefined' ) {
            this.questionparameters.textForScore10 = '';
            this.writeQuestionparametersToModel();
        }
    }

    /**
     * Setter for "textForScore0", a property of the question parameters.
     * @param val The text for rating 0.
     */
    public set textForScore0( val: string ) {
        this.questionparameters.textForScore0 = val;
        this.writeQuestionparametersToModel();
    }

    /**
     * Getter for "textForScore0", a property of the question parameters.
     */
    public get textForScore0(): string {
        return this.questionparameters.textForScore0;
    }

    /**
     * Setter for "textForScore10", a property of the question parameters.
     * @param val The text for rating 10.
     */
    public set textForScore10( val: string ) {
        this.questionparameters.textForScore10 = val;
        this.writeQuestionparametersToModel();
    }

    /**
     * Getter for "textForScore10", a property of the question parameters.
     */
    public get textForScore10(): string {
        return this.questionparameters.textForScore10;
    }

    /**
     * Handler when the selection of categories has got changed.
     */
    public categoriesChanged(): void {
        this.questionparameters.categories = this.forCategories.categories;
        this.writeQuestionparametersToModel();
    }

    /**
     * Get the question parameters stored as JSON string in the field "questionparameter".
     * Taking care also for the selection of categories.
     */
    public getQuestionparametersFromModel(): void {
        super.getQuestionparametersFromModel();
        this.forCategories.categories = this.questionparameters.categories;
    }

    /**
     * Write the question parameters object to the field "questionparameter", stored as JSON string.
     * Taking care also for the selection of categories.
     */
    public writeQuestionparametersToModel(): void {
        this.questionparameters.categories = this.forCategories.categories;
        super.writeQuestionparametersToModel();
    }

}
