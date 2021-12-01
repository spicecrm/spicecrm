/**
 * @module SystemComponents
 */
import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';


@Component({
    selector: 'package-loader-packages',
    templateUrl: '../templates/packageloaderpackages.html',
})
export class PackageLoaderPackages {

    @Input() public packagescope = '';
    public packagefilterterm: string = '';

    @Input() public packages = [];
    @Input() public repository: any;

    constructor(
        public language: language
    ) {

    }
}
