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
 * @module ModuleWorkflow
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';

/**
 * renders a dashlet with open Workflow Tasks for the user
 */
@Component({
    selector: 'workflow-taks-dashlet',
    templateUrl: './src/modules/workflow/templates/workflowtasksdashlet.html',
    providers: [model],
    styles: [
        ':host {width:100%; height: 100%;}'
    ]
})
export class WorkflowTasksDashlet {

    /**
     * the container refgerence .. for the setting of the dimensions
     */
    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) private itemcontainer: ViewContainerRef;

    /**
     * the tzasks to be rendered
     */
    private workflowtasks: any[] = [];

    constructor(private model: model, private modelutilities: modelutilities, private backend: backend, private language: language, private elementref: ElementRef) {
        this.workflowtasks = [];
        this.backend.getRequest('Workflows/mytasks').subscribe(wftasks => {
            for (let wftask of wftasks) {
                this.workflowtasks.push(this.modelutilities.backendModel2spice('WorkflowTasks', wftask));
            }
        });
    }


    /**
     * gets and sets the style for the dashlet
     */
    get containerStyle() {
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.itemcontainer.element.nativeElement.offsetTop + 'px)'
        };
    }


}