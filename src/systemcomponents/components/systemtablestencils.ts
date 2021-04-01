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
import {Component, Input, OnInit} from '@angular/core';

/**
 * a generic loading tbale component that renders a set of rows with stencoily that are fading out
 */
@Component({
    selector: '[system-table-stencils]',
    templateUrl: './src/systemcomponents/templates/systemtablestencils.html'
})
export class SystemTableStencils implements OnInit {

    /**
     * the numer of columns to be rendered
     */
    @Input() private columns: number = 1;

    /**
     * the number of rows to be rendered
     */
    @Input() private rows: number = 5;

    /**
     * is set to true expects the table to have a tools column and adds a separate column for the tools without a stencil in it
     */
    @Input() private tools: boolean = false;

    /**
     * if set to true expects the table to have a select column and renders a column in the beginning without a stencil
     */
    @Input() private select: boolean = false;

    /**
     * @ignore
     *
     * internal array for the columns
     */
    private colArray: any[] = [];

    /**
     * @ignore
     *
     * internal array for the ros
     */
    private rowArray: any[] = [];


    public ngOnInit() {
        // build columns
        let i = 1;
        do {
            this.rowArray.push(i);
            i++;
        } while (i <= this.rows)

        // build rows
        let j = 1;
        do {
            this.colArray.push(j);
            j++;
        } while (j <= this.columns)
    }

    /**
     * returns an opacity depending on the row index
     *
     * @param index the number of the row to be rendered
     */
    private linestyle(index) {
        return {
            opacity: 0.2 + (0.8 / index)
        };
    }
}
