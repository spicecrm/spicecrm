/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-navigation',
    templateUrl: './src/globalcomponents/templates/globalnavigation.html',
})
export class GlobalNavigation {

    constructor(private metadata: metadata) {

    }

}
