/**
 * @module SystemComponents
 */
import {Pipe} from '@angular/core';

@Pipe({
    name: 'systemstriphtmltagspipe',
    pure: false
})
export class SystemStripHtmlTagsPipe {

    public transform(value: string): any {
        return value.replace(/<.*?>/g, ''); // replace tags
    }
}
