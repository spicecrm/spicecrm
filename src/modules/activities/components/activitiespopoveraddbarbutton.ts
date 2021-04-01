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
 * @module ModuleActivities
 */
import {
    Component,
    OnInit,
    Input,
    Optional
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {relatedmodels} from '../../../services/relatedmodels.service';

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 *
 * The new model is added with two parents. Priority has the related if one is set. then the model itself. This allows executing multiple copy rules
 */
@Component({
    selector: 'activities-popover-addbar-button',
    templateUrl: './src/modules/activities/templates/activitiespopoveraddbarbutton.html',
    providers: [model]
})
export class ActivitiesPopoverAddBarButton {

    /**
     * the module we are creating here
     */
    @Input() private module: string = '';

    /**
     * the parent element
     */
    @Input() private parent: any;

    constructor(private model: model, private language: language, private metadata: metadata, @Optional() private relatedmodels: relatedmodels) {
    }

    /**
     * handle the click and create the model
     */
    private addModel() {
        this.model.module = this.module;

        // set the parents
        let parents = [this.parent];
        if (this.relatedmodels && this.relatedmodels.model) parents.push(this.relatedmodels.model);

        this.model.addModel('', parents);
    }
}
