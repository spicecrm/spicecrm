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
    Input
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'componensetmanager-add-dialog',
    templateUrl: './src/workbench/templates/componentsetmanageradddialog.html'
})
export class ComponentsetManagerAddDialog  {
    @Input() private module: string = '';
    @Input() private parent: string = '';

    private component: string = '';
    private systemmodule: string = '';
    private systemmodules: any[] = [];
    private showDeprecatedWarning: boolean = false;
    public self;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {
        this.systemmodules = this.metadata.getSystemModules();
    }

    get components() {
        return this.metadata.getSystemComponents(this.systemmodule);
    }

    private componentName(component) {
        if(component) {
            if(component.deprecated == '1') {
                return component.component + ' | dep.';
            } else {
                return component.component;
            }
        }
        return '';

    }

    private cancelDialog() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancelDialog();
    }

    private add() {
        this.metadata.addComponentToComponentset(this.modelutilities.generateGuid(), this.parent, this.component);
        this.self.destroy();
    }

    private checkDep(event) {
        let object = this.components.find(x => x.component === event);
        if(object.deprecated == '1') {
            this.showDeprecatedWarning = true;
        } else {
            this.showDeprecatedWarning = false;
        }
    }
}
