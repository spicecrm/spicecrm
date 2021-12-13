/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

/**
 * display formatted report record value with enum
 */
@Component({
    selector: 'reporter-field-enum',
    templateUrl: '../templates/reporterfieldenum.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldEnum implements OnInit {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};
    /**
     * display value
     */
    public value: string = '';

    constructor(public language: language, public metadata: metadata) {
    }

    /**
     * call to set the display value
     */
    public ngOnInit(): void {
        this.setFormattedFieldValue();
    }

    /**
     * set formatted field value
     */
    public setFormattedFieldValue() {

        let pathArray = this.field.path.split('::');

        let arrCount = pathArray.length;

        // the last entry has to be the field
        let fieldArray = pathArray[arrCount - 1].split(':');
        const fieldName = fieldArray[1];
        let moduleName;
        let moduleArray = pathArray[arrCount - 2].split(':');
        switch (moduleArray[0]) {
            case 'root':
                moduleName = moduleArray[1];
                break;
            case 'link':
                let field = this.metadata.getFieldDefs(moduleArray[1], moduleArray[2]);
                moduleName = field.module;
                break;
        }

        if (fieldName && moduleName) {
            this.value = this.language.getFieldDisplayOptionValue(moduleName, fieldName, this.record[this.field.fieldid + '_val']);
        } else {
            this.value = this.record[this.field.fieldid];
        }
    }
}
