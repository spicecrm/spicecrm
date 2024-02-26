/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';

declare var _: any;

@Component({
    selector: 'reporter-field-container',
    templateUrl: '../templates/reporterfieldcontainer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldContainer implements OnInit {

    /**
     * the record from the reporter
     */
    @Input() public record: any = {};

    /**
     * alternative value passed in direct
     */
    @Input() public value: any = '';
    /**
     * report field
     */
    @Input() public field: any = {};

    /**
     * the module for the link
     */
    public recordModule: string;

    /**
     * the id for the link
     */
    public recordId: string;

    /**
     * the field type to be rendered
     */
    public fieldType;

    constructor(public metadata: metadata) {

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
    public initializeRecord() {
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
    public buildLinkInfo() {
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
    public determineFieldType() {
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
                case 'category':
                    this.fieldType = 'ReporterFieldCategoryTree';
                    break;
                case 'number':
                case 'float':
                    this.fieldType = 'ReporterFieldNumber';
                    break;
                case 'int':
                    this.fieldType = 'ReporterFieldInteger';
                    break;
                default:
                    this.fieldType = 'ReporterFieldStandard';
                    break;
            }
        }
    }
}
