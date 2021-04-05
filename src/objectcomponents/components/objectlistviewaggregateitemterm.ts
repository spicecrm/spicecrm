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
 * @module ObjectComponents
 */
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * renders a term Aggregate item using a field container
 */
@Component({
    selector: 'object-listview-aggregate-item-term',
    templateUrl: './src/objectcomponents/templates/objectlistviewaggregateitemterm.html',
    providers: [view, model]
})
export class ObjectListViewAggregateItemTerm implements OnInit {

    /**
     * the item in the aggregate
     */
    @Input() private item: any = {};

    /**
     * the aggregate
     */
    @Input() private aggregate: any = {};

    constructor(private model: model, private view: view) {
        this.view.displayLabels = false;
    }

    /**
     * initializes teh model with the module and the value for the one field
     */
    public ngOnInit(): void {
        this.model.module = this.aggregate.fielddetails.module;
        // convert the value to a model value .. fix for the boolean aggregate
        this.model.setField(this.aggregate.fielddetails.field, this.model.utils.backend2spice(this.model.module, this.aggregate.fielddetails.field,  this.item.key));
    }
}
