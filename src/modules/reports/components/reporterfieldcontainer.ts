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
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';

declare var _: any;

@Component({
    selector: 'reporter-field-container',
    templateUrl: './src/modules/reports/templates/reporterfieldcontainer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldContainer implements OnInit {

    /**
     * the record from the reporter
     */
    @Input() private record: any = {};

    /**
     * alternative value passed in direct
     */
    @Input() private value: string = '';
    /**
     * report field
     */
    @Input() private field: any = {};

    /**
     * the module for the link
     */
    private recordModule: string;

    /**
     * the id for the link
     */
    private recordId: string;

    /**
     * the field type to be rendered
     */
    private fieldType;

    constructor(private metadata: metadata) {

    }

    /**
     * initialize the record
     */
    public ngOnInit(): void {

        // build a re cord if do not have one
        this.initializeRecord();

        // build the link info
        this.buildLinkInfo();

        // get the field type and component to be rendered
        this.determineFieldType();
    }

    /**
     * initializes the record if a value is passed in but no record is present
     */
    private initializeRecord() {
        // if we have a value an no record ... create the record
        if (this.value && _.isEmpty(this.record)) {
            this.record = {};
            this.record[this.field.fieldid] = this.value;
            this.record[this.field.fieldid + '_val'] = this.value;
        }
    }

    /**
     * builds the info for the link if we have one
     */
    private buildLinkInfo() {
        if (this.field.link == 'yes' && this.record) {
            // route to the proper module
            // check if a link info is set
            if (this.field.linkinfo && this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root']) {

                this.recordModule = this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root'].module;
                this.recordId = this.record[this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root'].idfield];

            } else if (this.hasPathField) {
                // get the path info
                let pathinfo = this.fieldPathInfo;

                // build the path array
                let pathArray = pathinfo.path.split('::');

                // get the last entry with link and field
                let linkInfo = pathArray.pop();

                // split the link array
                let linkArray = linkInfo.split(':');

                // get the info ont eh field
                let fieldData = this.metadata.getFieldDefs(linkArray[1], linkArray[2]);

                // set the field data
                this.recordModule = fieldData.module;
                this.recordId = this.fieldPathInfo.id;
            } else {
                // must be the root module then
                this.recordModule = this.record.sugarRecordModule;
                this.recordId = this.record.sugarRecordId;
            }
        }
    }


    get fieldPathInfo() {
        // remove the field info from the field path
        let pathAray = this.field.path.split('::');
        pathAray.pop();

        let sanitizedPath = pathAray.join('::');

        let pathInfo;
        for (let fieldid in this.record) {
            if (this.record.hasOwnProperty(fieldid) && this.record[fieldid] == sanitizedPath) {
                pathInfo = {};
                pathInfo.path = sanitizedPath;
                pathInfo.id = this.record[fieldid.replace('path', 'id')];
                break;
            }
        }

        return pathInfo;
    }

    get hasPathField() {
        // remove the field info from the field path
        let pathAray = this.field.path.split('::');
        pathAray.pop();

        // if we only have one entry we must be on root
        if(pathAray.length == 1) return false;

        // else join the path for the latch
        let sanitizedPath = pathAray.join('::');

        // check if we find a matching record field
        for (let fieldid in this.record) {
            if (this.record.hasOwnProperty(fieldid) && this.record[fieldid] == sanitizedPath) {
                return true;
            }
        }

        // in case of doubt nothing found
        return false;
    }

    /**
     * determines the field type and the component to be rendered for this
     */
    private determineFieldType() {
        if (this.field.component) {
            this.fieldType = this.field.component;
        } else {
            switch (this.field.type) {
                case 'percentage':
                    this.fieldType = 'ReporterFieldPercentage';
                    break;
                case 'currency':
                case 'currencyint':
                    this.fieldType = 'ReporterFieldCurrency';
                    break;
                case 'enum':
                case 'multienum':
                case 'radioenum':
                    this.fieldType = 'ReporterFieldEnum';
                    break;
                case "datetimecombo":
                case "datetime":
                    this.fieldType = 'ReporterFieldDateTime';
                    break;
                case 'date':
                    this.fieldType = 'ReporterFieldDate';
                    break;
                case 'text':
                    this.fieldType = 'ReporterFieldText';
                    break;
                default:
                    this.fieldType = 'ReporterFieldStandard';
                    break;
            }
        }
    }
}
