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
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';

declare var _: any;
@Component({
    selector: 'questions-manager-edit-rating-group',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditratinggroup.html'
})
export class QuestionsManagerEditRatingGroup extends QuestionsManagerEditBasic implements OnInit {

    @Input() public questionset: any = {};
    @Input() public categorypool;

    private entries: any[] = [];
    private options: any[] = [];
    private isBuilt = false;

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
        this.view.isEditable = true;
        this.view.setEditMode();
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
        let config: any;
        try {
            config =  JSON.parse(this.questionset.data.questiontypeparameter);
        } catch ( e ) {
            return;
        }
        if ( config.rating && config.rating.entries ) this.entries = config.rating.entries;
        for (let entry of this.entries) {
            let isOptionFound: boolean = false;
            let optionFoundId: string;
            if (this.model.data.questionoptions && this.model.data.questionoptions.beans) {
                for ( let optionId in this.model.data.questionoptions.beans ) {
                    if( this.model.data.questionoptions.beans[optionId].questionset_type_parameter_id === entry.id ) {
                        isOptionFound = true;
                        optionFoundId = optionId;
                        continue;
                    }
                }
            } else this.model.data.questionoptions = {beans:{}};
            let newOptionId: string;
            if (!isOptionFound) {
                newOptionId = this.model.generateGuid();
                this.model.data.questionoptions.beans[newOptionId] = {
                    id: newOptionId,
                    question_id: this.model.id,
                    name: entry.value,
                    categories: '',
                    points: '',
                    questionset_type_parameter_id: entry.id
                };
            }
            this.options.push(this.model.data.questionoptions.beans[ isOptionFound ? optionFoundId : newOptionId ]);
        }
    }

    private change(): void { null; }

}
