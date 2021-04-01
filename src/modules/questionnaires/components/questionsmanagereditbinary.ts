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
import { QuestionsManagerEditBasicWithOptions } from './questionsmanagereditbasicwithoptions';

declare var _: any;

@Component({
    selector: 'questions-manager-edit-binary',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditbinary.html',
    styles: [ 'tr.no-hover:hover td { background-color: inherit; box-shadow: none !important; }']
})
export class QuestionsManagerEditBinary extends QuestionsManagerEditBasicWithOptions implements OnInit {

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet
        });
    }

    /**
     * Build the list of options, after the question model (with question options) has been loaded.
     */
    public buildEntries(): void {
        this.isBuilt = true;
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans) {
            this.model.data.questionoptions = {beans: {}};
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i=0; i<2; i++ ) {
            if ( !keys[i] || !this.model.data.questionoptions.beans[keys[i]] ) {
                let newOptionId: string = this.model.generateGuid();
                if ( !keys[i] ) keys.push(newOptionId);
                this.model.data.questionoptions.beans[newOptionId] = {
                    id: newOptionId,
                    question_id: this.model.id,
                    name: '',
                    categories: '',
                    points: '',
                    position: i
                };
            }
            this.options[i] = this.model.data.questionoptions.beans[keys[i]];
        }
    }

    /**
     * Exchange the two options (swap).
     */
    public exchangeOptions(): void {
        let tmp = this.options[0];
        this.options[0] = this.options[1];
        this.options[1] = tmp;
        this.options[0].position = 0;
        this.options[1].position = 1;
        this.generateName();
    }

    /**
     * Handler in case the options got changed.
     * @param event Event
     */
    public handleChange( event ): void {
        if ( event === true ) this.generateName();
    }

    /**
     * Generate the question name in case it is not specified yet. Generate it from the two option names.
     */
    public generateName(): void {
        if ( !this.name && this.options[0].name && this.options[1].name ) {
            this.name = this.options[0].name + ' / ' + this.options[1].name;
        }
    }

}
