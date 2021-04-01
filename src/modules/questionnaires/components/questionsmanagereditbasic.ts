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
import { Component, OnInit, Input } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'questions-manager-edit-basic',
    template: ''
})
export class QuestionsManagerEditBasic implements OnInit {

    /**
     * The categories that are available for selection.
     */
    @Input() public categorypool;

    /**
     * A unique ID for the component. Used for the attributes "id" and "for" in html elements.
     */
    private compId = _.uniqueId();

    /**
     * The name field is required. Missing?
     */
    public nameMissing = false;

    /**
     * Parameter object of the question.
     */
    public questionparameters: any;

    constructor( public language: language, public model: model, public view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        if ( !this.model.data.questionparameter || this.model.data.questionparameter.length === 0 ) {
            this.model.data.questionparameter = '{}';
        }
        this.getQuestionparametersFromModel();
    }

    /**
     * Get the question parameters stored as JSON string in the field "questionparameter".
     */
    public getQuestionparametersFromModel(): void {
        this.questionparameters = JSON.parse( this.model.getField('questionparameter'));
    }

    /**
     * Write the question parameters object to the field "questionparameter", stored as JSON string.
     */
    public writeQuestionparametersToModel(): void {
        this.model.setField('questionparameter', JSON.stringify( this.questionparameters ));
    }

    /**
     * Setter for the name of the question.
     * @param val The name of the question.
     */
    public set name( val: string ) {
        this.model.setField('name',val);
    }

    /**
     * Getter for the name of the question.
     */
    public get name(): string {
        return this.model.getField('name');
    }

    /**
     * Setter for the question text of the question.
     * @param val The question text of the question.
     */
    public set questiontext( val: string ) {
        this.model.setField('questiontext', val );
    }

    /**
     * Getter for the question text of the question.
     */
    public get questiontext(): string {
        return this.model.getField('questiontext');
    }

    /**
     * Handler when the question text field lost focus and might got changed.
     */
    public questiontextBlurred(): void {
        if ( !this.name ) {
            this.name = this.questiontext;
            this.nameChanged();
        }
    }

    /**
     * Handler when the name field lost focus and might got changed.
     */
    public nameBlurred(): void {
        if ( !this.name ) {
            this.name = this.questiontext;
            this.nameChanged();
        }
    }

    /**
     * To do, when the name field got changed.
     */
    public nameChanged(): void {
        this.nameMissing = !this.name;
    }

}
