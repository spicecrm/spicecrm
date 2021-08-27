/**
 * @module SystemComponents
 */
import {
    Component, Input
} from '@angular/core';

@Component({
    selector: 'package-loader-languages',
    templateUrl: './src/systemcomponents/templates/packageloaderlanguages.html',
})
export class PackageLoaderLanguages {

    @Input() private languages = [];
    @Input() private repository: any;

}
