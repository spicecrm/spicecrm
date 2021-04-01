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
 * @module ObjectComponents
 */
import {
    OnInit,
    ComponentFactoryResolver,
    Component,
    Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

/**
 * renders the footer bar with a save and a cancel button
 *
 * needs to be embedded in a component providing a view and a model
 */
@Component({
    selector: 'object-record-details-footer',
    templateUrl: './src/objectcomponents/templates/objectrecorddetailsfooter.html'
})
export class ObjectRecordDetailsFooter implements OnInit{

    /**
     * the actionset to be rendered
     */
    private actionset: string;

    constructor(private view: view, private model: model, private language: language, private metadata: metadata) {
    }

    public ngOnInit(): void {
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetailsFooter', this.model.module);
        this.actionset = componentconfig.actionset;
    }

    /**
     * cancels editing and sets the view back to viewMode
     */
    private cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    /**
     * saves the model and sets the view back to view mode
     */
    private save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }
}
