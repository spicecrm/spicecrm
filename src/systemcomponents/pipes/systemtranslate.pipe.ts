import {inject, Pipe, PipeTransform} from '@angular/core';
import {language} from "../../services/language.service";

@Pipe({
    name: 'systemtranslate'
})
export class SystemTranslatePipe implements PipeTransform {

    public language: language = inject(language);

    /**
     * translate a label
     * @param label
     * @param length
     * @param nestedValues
     */
    transform(label: any, length: 'default' | 'long' | 'short' = 'default', nestedValues?: any): string {

        if (nestedValues) {
            return this.language.getLabelFormatted(label, nestedValues, length);
        } else {
            return this.language.getLabel(label, undefined, length);
        }
    }
}