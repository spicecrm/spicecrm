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
 * @module ModuleSalesDocs
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

declare var _: any;

@Component({
    templateUrl: "./src/modules/salesdocs/templates/salesdocsconvertmodal.html",
    providers: [model]
})
export class SalesDocsConvertModal {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    private self: any;

    /**
     * the targetdata loaded from the backend that is supposed to be created as new salesdoc
     */
    public targetData: any;

    constructor(public model: model, @SkipSelf() private parent: model, public modal: modal, private backend: backend) {
    }

    private close() {
        this.self.destroy();
    }

    private convert() {
        this.model.module = 'SalesDocs';
        let newdata = {};
        for(let field in this.targetData.SalesDoc){
            if(!_.isEmpty(this.targetData.SalesDoc[field])){
                newdata[field] = this.targetData.SalesDoc[field];
            }
        }
        this.model.addModel(null, null, newdata);

        // add the items to the model
        this.model.data.salesdocitems = {
            beans: {}
        };

        let itemnr = 10;
        for (let salesdocitem of this.targetData.SalesDocItems) {
            if(salesdocitem._selected) {
                salesdocitem.id = this.model.utils.generateGuid();
                salesdocitem.itemnr = itemnr;
                this.model.data.salesdocitems.beans[salesdocitem.id] = {...salesdocitem};
                itemnr = itemnr + 10;
            }
        }

        this.close();
    }

}
