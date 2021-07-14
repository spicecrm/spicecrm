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
 * @module ModuleReportsDesigner
 */
import {Component, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-condition-group-expansion',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerconditiongroupexpansion.html'
})
export class ReportsDesignerConditionGroupExpansion implements OnInit {

    /**
     * @input whereCondition: object
     */
    @Input() private whereCondition: any;

    private contextUsed: boolean = false;

    constructor(private language: language, private model: model) {
    }

    /**
     * disable the required checkbox if we are on a root elemet
     */
    get requiredEnabled() {
        return this.whereCondition.path.split('::').length > 2;
    }

    /**
     * @param value boolean
     * @set jointype = 'required' | 'optional'
     */
    set joinType(value) {
        this.whereCondition.jointype = value ? 'required' : 'optional';
    }

    /**
     * @return jointype: boolean
     */
    get joinType() {
        return this.whereCondition.jointype == 'required';
    }

    /**
     * @return jointype: boolean
     */
    get referenceDisabled() {
        const referenceUsed = this.model.getField('whereconditions')
            .some(condition => this.whereCondition.fieldid != condition.fieldid && condition.operator == 'reference' && condition.value == this.whereCondition.reference);
        return this.whereCondition.operator == 'reference' || referenceUsed;
    }

    public ngOnInit() {
        this.setContextReferenceUse();
    }

    /**
     * set the contextUsed to true if any of visualizationParams plugins has used it
     */
    private setContextReferenceUse() {
        const visualizationParams = this.model.getField('visualization_params');
        if (!visualizationParams) return;
        for (let key in visualizationParams) {
            if (visualizationParams.hasOwnProperty(key)) {
                if (!!visualizationParams[key].googlecharts) {
                    if (!!visualizationParams[key].googlecharts.context && !!this.whereCondition.context &&
                        this.whereCondition.context == visualizationParams[key].googlecharts.context) {
                        this.contextUsed = true;
                    }
                }
                if (!!visualizationParams[key].highcharts) {
                    if (!!visualizationParams[key].highcharts.context && !!this.whereCondition.context &&
                        this.whereCondition.context == visualizationParams[key].highcharts.context) {
                        this.contextUsed = true;
                    }
                }
            }
        }
    }
}
