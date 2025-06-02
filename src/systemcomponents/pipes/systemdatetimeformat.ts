import {Pipe, PipeTransform} from '@angular/core';

declare var moment;

@Pipe({
    name: 'systemDateTimeFormat'
})
export class SystemDateTimeFormatPipe implements PipeTransform {
    /**
     * return a formatted moment object with the given format
     * @param value
     * @param format
     * @param useUtc
     */
    public transform(value: any, format: string, useUtc?: boolean): string {

        if (!value) return '';

        if (useUtc) {
            return moment.utc(value).format(format);
        } else {
            return moment(value).format(format);
        }
    }
}