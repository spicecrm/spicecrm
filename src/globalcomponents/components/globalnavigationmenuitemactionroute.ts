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
 * @module GlobalComponents
 */
import {
    Component,
} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitemactionroute.html'
})
export class GlobalNavigationMenuItemActionRoute {

    /**
     * the action config passed in from teh container
     */
    private actionconfig: any = {};

    /**
     * if the item is disabled
     */
    public disabled: boolean = false;

    constructor(private language: language, private model: model, private router: Router) {
    }

    /**
     * a getter extracting the icon from the action config
     */
    get actionicon() {
        return this.actionconfig.icon ? this.actionconfig.icon : 'chevronright';
    }

    /**
     * a getter to extzract the label to be used from teh action config
     */
    get actionlabel() {
        if (this.actionconfig.label && this.actionconfig.label.indexOf(':') > -1) {
            let labelData = this.actionconfig.label.split(':');
            return this.language.getLabel(labelData[0], labelData[1]);
        } else {
            return this.language.getLabel(this.actionconfig.label);
        }
    }

    /**
     * the execute function to naviogate to the route defined in the action
     */
    public execute() {
        this.router.navigate([this.actionconfig.route]);
    }
}
