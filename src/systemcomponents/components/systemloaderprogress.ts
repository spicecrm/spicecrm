/**
 * @module SystemComponents
 */
import {
    Component
} from '@angular/core';
import {loader} from '../../services/loader.service';


@Component({
    selector: 'system-loader-progress',
    templateUrl: '../templates/systemloaderprogress.html'
})
export class SystemLoaderProgress {
        constructor(public loader: loader) { }


}
