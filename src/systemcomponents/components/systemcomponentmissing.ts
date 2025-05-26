/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';

@Component({
    selector: 'system-component-missing',
    templateUrl: '../templates/systemcomponentmissing.html',
    standalone: false
})
export class SystemComponentMissing {

    public component: string = '';

}
