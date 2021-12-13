/**
 * @module SystemComponents
 */
import {
    Component, Input
} from '@angular/core';

@Component({
    selector: 'package-loader-languages',
    templateUrl: '../templates/packageloaderlanguages.html',
})
export class PackageLoaderLanguages {

    @Input() public languages = [];
    @Input() public repository: any;

}
