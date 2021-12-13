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
    templateUrl: '../templates/reporterfieldtext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldText {
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
    public value: SafeHtml = '';

    constructor(public sanitizer: DomSanitizer) {
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
    public setFormattedFieldValue() {

        if (!!this.record[this.field.fieldid]) {
            this.value = this.sanitizer.bypassSecurityTrustHtml(this.record[this.field.fieldid].replace(/(?:\r\n|\r|\n)/g, '<br>'));

        }
    }
}
