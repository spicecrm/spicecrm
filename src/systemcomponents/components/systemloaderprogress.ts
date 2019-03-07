/**
 * @module SystemComponents
 */
import {
    Component
} from '@angular/core';
import {loader} from '../../services/loader.service';


@Component({
    selector: 'system-loader-progress',
    templateUrl: './src/systemcomponents/templates/systemloaderprogress.html'
})
export class SystemLoaderProgress {
        constructor(private loader: loader) { }


}
