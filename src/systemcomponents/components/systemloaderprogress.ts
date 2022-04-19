/**
 * @module SystemComponents
 */
import {
    Component
} from '@angular/core';
import {loader} from '../../services/loader.service';


/**
 * displays the loader progress
 */
@Component({
    selector: 'system-loader-progress',
    templateUrl: '../templates/systemloaderprogress.html'
})
export class SystemLoaderProgress {
    constructor(public loader: loader) {
    }

    /**
     * a getter since from DB the loader might be too fast and we can eventually get a value higher than 100 .. which we do not want
     */
    get progress() {
        return this.loader.progress > 100 ? 100 : this.loader.progress;
    }
}
