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
 * @module SystemComponents
 */
import {Component, Input, Optional} from "@angular/core";
import {view} from '../../services/view.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * a simple view container component. renders a div with a view provided
 */
@Component({
    selector: "system-view-container",
    templateUrl: "./src/systemcomponents/templates/systemviewcontainer.html"
})
export class SystemViewContainer {
    /**
     * input param for the componentconfig to be added when the component is added
     */
    @Input() public componentconfig: any = {};

    constructor(private view: view, private language: language, @Optional() private model: model) {
    }

    /**
     * a simple getter to retrive the componentset from the config
     */
    get componentset() {
        return this.componentconfig.componentset;
    }

    /**
     * a simple getter to check if the config allows to be editable
     */
    get editable() {
        return this.model && this.componentconfig.editable ? true : false;
    }

    /**
     * cancels editing and sets the view back to viewMode
     */
    private cancel() {
        if(this.model) {
            this.model.cancelEdit();
            this.view.setViewMode();
        }
    }

    /**
     * saves the model and sets the view back to view mode
     */
    private save() {
        if (this.model && this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }
}
