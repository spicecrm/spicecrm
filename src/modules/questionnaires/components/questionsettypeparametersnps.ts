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
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {helper} from "../../../services/helper.service";

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'questionset-type-parameters-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsettypeparametersnps.html',
    providers: [helper]
})
export class QuestionsetTypeParametersNPS implements OnInit {

    private componentId: string;
    private textForScore0 = '';
    private textForScore10 = '';

    constructor( private language: language, private model: model, private view: view, private toast: toast, private helper: helper ) {
        this.componentId = _.uniqueId();
    }

    get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.parseParams();
        this.model.data$.subscribe( () => this.parseParams() );
    }

    /**
     * The question type specific settings are stored in the field "questiontypeparameter" as json string.
     * This method parses the json string to an object.
     */
    private parseParams(): void {
        let jsonString = this.model.getField('questiontypeparameter');
        if ( jsonString !== '' ) {
            let config = JSON.parse( jsonString );
            if ( config.nps ) {
                this.textForScore0 = config.nps.textForScore0;
                this.textForScore10 = config.nps.textForScore10;
            }
        }
    }

    /**
     * The question type specific settings are stored in the field "questiontypeparameter" as json string.
     * This method should be called after any change of any setting. It generates the json string and writes it to the model.
     */
    private writeSettings(): void {
        let config =  ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ? JSON.parse( this.model.data.questiontypeparameter ):{});
        config.nps = {
            textForScore0: this.textForScore0,
            textForScore10: this.textForScore10
        };
        this.model.setField('questiontypeparameter', JSON.stringify( config ));
    }

}
