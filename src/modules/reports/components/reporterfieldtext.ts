/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

/**
 * display formatted report record value with text
 */
@Component({
    selector: 'reporter-field-text',
    templateUrl: './src/modules/reports/templates/reporterfieldtext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldText {
    /**
     * report full record
     */
    private record: any = {};
    /**
     * report field
     */
    private field: any = {};
    /**
     * display value
     */
    private value: SafeHtml = '';

    constructor(private sanitizer: DomSanitizer) {
    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setFormattedFieldValue();
    }

    /**
     * set formatted field value
     */
    private setFormattedFieldValue() {

        if (!!this.record[this.field.fieldid]) {
            this.value = this.sanitizer.bypassSecurityTrustHtml(this.record[this.field.fieldid].replace(/(?:\r\n|\r|\n)/g, '<br>'));

        }
    }
}
