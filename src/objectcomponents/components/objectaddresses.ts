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
import {Component,  OnInit, Pipe} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Pipe({
    name: 'objectaddressespipe',
    pure: false
})
export class ObjectAddressesPipe {

    transform(addresses) {
        let retValues = [];

        for (let addressid in addresses)
            retValues.push(addresses[addressid]);

        return retValues;
    }
}

@Component({
    selector: 'object-addresses',
    templateUrl: './src/objectcomponents/templates/objectaddresses.html',
    host: {
        '[style.display]': 'getDisplay()'
    },
})
export class ObjectAddresses implements OnInit {

    componentconfig: any = {};
    expanded: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private modelutilities: modelutilities) {

    }

    get hasAddresses() {
        try {
            return this.model.data.addresses.beans != undefined;
        } catch (e) {
            return false;
        }
    }

    ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }
    }

    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate) );
    }

    getDisplay(){
        if(this.addresses.length > 0 || this.view.isEditMode())
            return 'inherit';

        return 'none';
    }

    get addresses() {
        let retValues = [];
        try {
            for (let addressid in this.model.data.addresses.beans) {
                if (this.model.data.addresses.beans[addressid].deleted == false)
                    retValues.push(this.model.data.addresses.beans[addressid]);
            }
        } catch (e) {
            // do nothing
        }
        return retValues;
    }

    togglePanel() {
        this.expanded = !this.expanded;
    }

    getChevronStyle() {
        if (!this.expanded)
            return {
                'transform': 'rotate(45deg)',
                'margin-top': '4px'
            }
    }

    getTabStyle() {
        if (!this.expanded)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

    addAddress() {
        let newID = this.modelutilities.generateGuid();

        // if no addresses are defined yet .. define the array
        if (this.model.data.addresses == undefined) {
            this.model.data.addresses = {
                beans: []
            };
        }
        this.model.data.addresses.beans[newID] = {
            id: newID,
            deleted: false
        };
    }


}