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
import { QuestionsManagerEditBasicWithOptions } from './questionsmanagereditbasicwithoptions';

@Component({
    selector: 'questions-manager-edit-multi',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditmulti.html'
})
export class QuestionsManagerEditMulti extends QuestionsManagerEditBasicWithOptions implements OnInit {

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the properties "minAnswers", "maxAnswers" and "hasInfosCorrectness", if not yet existing in the question parameter object.
        // "minAnswers", "minAnswers" and "hasInfosCorrectness" are specific for questions of type "multi".
        if ( typeof this.questionparameters.minAnswers === 'undefined' ) {
            this.questionparameters.minAnswers = '';
            this.writeQuestionparametersToModel();
        }
        if ( typeof this.questionparameters.maxAnswers === 'undefined' ) {
            this.questionparameters.maxAnswers = '';
            this.writeQuestionparametersToModel();
        }
        if ( typeof this.questionparameters.hasInfosCorrectness === 'undefined' ) {
            this.questionparameters.hasInfosCorrectness = false;
            this.writeQuestionparametersToModel();
        }
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet (options are not built yet)
        });
    }

    /**
     * Build the list of options, after the question model (with question options) has been loaded.
     */
    public buildEntries(): void {
        this.isBuilt = true;
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = { beans:{} };
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i in keys ) this.options[i] = this.model.data.questionoptions.beans[keys[i]];
    }

    /**
     * Handler if the the min. and max. number of answers got changed.
     * @param event Event
     */
    private onChange_numAnswers(): void {
        this.writeQuestionparametersToModel();
    }

    /**
     * Handler if the flag "onChange_hasInfosCorrectness" got changed.
     * @param event Event
     */
    private onChange_hasInfosCorrectness( event ): void {
        this.questionparameters.hasInfosCorrectness = event.target.checked;
        this.writeQuestionparametersToModel();
    }

    /**
     * Done before saving:
     * In case the correctness of options is not defined, set all to false.
     */
    public doBeforeSavingQuestion(): void {
        if ( !this.questionparameters.hasInfosCorrectness ) {
            this.options.some( option => {
                option.is_correct_option = false;
                return false;
            } );
        }
    }

}
