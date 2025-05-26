/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-navigation',
    templateUrl: '../templates/globalnavigation.html',
    standalone: false
})
export class GlobalNavigation {

    constructor(public metadata: metadata) {

    }

}
