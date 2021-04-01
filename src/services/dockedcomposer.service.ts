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
 * @module services
 */
import {Injectable} from '@angular/core';
import {modelutilities} from './modelutilities.service';
import {broadcast} from './broadcast.service';
import {model} from "./model.service";

/**
 * holds all current composers
 */
@Injectable()
export class dockedComposer {
    /**
     * the regular composers
     */
    public composers: any[] = [];

    /**
     * the hidden composers. They are folded away in a separate tab
     */
    public hiddenComposers: number[] = [];

    constructor(private modelutilities: modelutilities, private broadcast: broadcast) {

        // subscribe to the logout so we can remove all open composers
        this.broadcast.message$.subscribe(message => this.handleLogout(message));
    }

    private handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.composers = [];
            this.hiddenComposers = [];
        }
    }

    /**
     * adds a composer
     *
     * @param module the module for which the composer is
     * @param model optional a model that can be passed in with the model data
     * @param expanded optional set to true if the composer should automatically expand if expand is possible
     */
    public addComposer(module: string, model?: model, expanded?: boolean) {

        if (model) {
            this.composers.splice(0, 0, {
                module,
                id: model.id,
                name: model.getField('summary_text'),
                model: {
                    module,
                    id: model.id,
                    data: model.data
                },
                loadexpanded: expanded
            });

        } else {
            this.composers.splice(0, 0, {
                module,
                id: this.modelutilities.generateGuid(),
                name: '',
                model: {},
                loadexpanded: expanded
            });
        }

    }

    /**
     * focus on a specific composer and bring that one into view
     *
     * @param id the id of the composer
     */
    public focusComposer(id) {
        this.composers.some((composer, index) => {
            if (composer.id == id) {
                let movedComposer = this.composers.splice(index, 1);
                this.composers.unshift(movedComposer.shift());
                return true;
            }
        });
    }

    /**
     * caclulates the number of composers that can max be displayed
     */
    get maxComposers() {
        return Math.floor((window.innerWidth - 70) / 500);
    }
}
