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
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-filter-builder-expression-values',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilderfilterexpressionvalues.html',
})
export class SystemFilterBuilderFilterExpressionValues implements OnChanges {

    /**
     * the module we are attaching this filter to
     */
    @Input() public module: string;

    /**
     * the field
     */
    @Input() public field: string;

    /**
     * the operator
     */
    @Input() private operator: any;
    @Input() private operators: any[];

    /**
     * the durrect set filter expression
     */
    @Input() private filterexpression: any = {};

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
    ) {

    }

    public ngOnChanges(changes: SimpleChanges): void {
    }

    get value1() {
        let operator = this.operators.find(op => op.operator == this.operator);
        return operator.value1;
    }

    get value2() {
        let operator = this.operators.find(op => op.operator == this.operator);
        return operator.value2;
    }

    /**
     * returns if any of the two value is set
     */
    private showValues() {
        return this.operator.value1 || this.operator.value2;
    }

}
