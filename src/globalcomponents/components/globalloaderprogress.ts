import {
    Component
} from '@angular/core';
import {loader} from '../../services/loader.service';


@Component({
    selector: 'global-loader-progress',
    templateUrl: './src/globalcomponents/templates/globalloaderprogress.html'
})
export class GlobalLoaderProgress {
        constructor(private loader: loader) { }


}
