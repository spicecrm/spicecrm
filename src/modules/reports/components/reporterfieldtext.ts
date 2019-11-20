/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";


@Component({
    selector: 'reporter-field-text',
    templateUrl: './src/modules/reports/templates/reporterfieldtext.html'
})
export class ReporterFieldText {

    /**
     * the complete record
     */
    private record: any = {};

    /**
     * the field
     */
    private field: any = {};

    constructor(private sanitizer: DomSanitizer) {}

    get sanitizedValue(){
        return this,this.sanitizer.bypassSecurityTrustHtml(this.record[this.field.fieldid].replace(/(?:\r\n|\r|\n)/g, '<br>'));
    }
}
