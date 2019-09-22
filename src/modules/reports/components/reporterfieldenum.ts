/**
 * @module ModuleReports
 */
import {
    Component, OnInit
} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reporter-field-enum',
    templateUrl: './src/modules/reports/templates/reporterfieldenum.html'
})
export class ReporterFieldEnum implements OnInit {

    private record: any = {};
    private field: any = {};

    private fieldName: string;
    private moduleName: string;

    constructor(private language: language, private metadata: metadata) {

    }

    public ngOnInit(): void {
        let pathArray = this.field.path.split('::');

        let arrCount = pathArray.length;

        // the last entry has to be the field
        let fieldArray = pathArray[arrCount - 1].split(':');
        this.fieldName = fieldArray[1];

        let moduleArray = pathArray[arrCount - 2].split(':');
        switch (moduleArray[0]) {
            case 'root':
                this.moduleName = moduleArray[1];
                break;
            case 'link':
                let field = this.metadata.getFieldDefs(moduleArray[1], moduleArray[2]);
                this.moduleName = field.module;
                break;
        }

    }

    get value() {
        if (this.fieldName && this.moduleName) {
            return this.language.getFieldDisplayOptionValue(this.moduleName, this.fieldName, this.record[this.field.fieldid + '_val']);
        } else {
            return this.record[this.field.fieldid];
        }
    }

}
