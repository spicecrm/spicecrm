/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
    OnChanges
} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {backend} from "../../services/backend.service";

@Component({
    templateUrl: './src/workbench/templates/workbenchconfig.html',
    selector: 'workbench-config'
})

export class WorkbenchConfig implements OnChanges {

    @ViewChild('optionscontainer', {read: ViewContainerRef, static: true}) public optionscontainer: ViewContainerRef;

    @Input() public component: string = "";
    @Input() public configValues: any = {};

    public configOptions: any[] = [];
    public optionsElements: any[] = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language
    ) {
    }

    public ngOnChanges(changes: SimpleChanges) {

        // remove any options elements in case some exist
        for (let option of this.optionsElements) {
            option.destroy();
        }
        this.optionsElements = [];

        // build new config options
        this.configOptions = [];


        let options = this.metadata.getComponentConfigOptions(this.component);
        for (let option in options) {
            this.configOptions.push({
                option,
                type: options[option].type ? options[option].type : 'string',
                description: options[option].description ? options[option].description : ''
            });
        }

        // add the elements dynamically
        for (let fieldconfig of this.configOptions) {
            let component = '';
            let type = fieldconfig.type.charAt(0).toUpperCase() + fieldconfig.type.slice(1);
            component = 'WorkbenchConfigOption' + type;

            // check availability
            if (!this.metadata.checkComponent(component)) {
                component = 'WorkbenchConfigOptionDefault';
            }

            this.metadata.addComponent(component, this.optionscontainer).subscribe(
                cmpref => {
                    this.optionsElements.push(cmpref);
                    cmpref.instance.option = fieldconfig;
                    cmpref.instance.configValues = this.configValues;
                }
            );
        }
    }
}
