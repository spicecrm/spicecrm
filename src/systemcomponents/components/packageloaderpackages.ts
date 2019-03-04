/**
 * @module SystemComponents
 */
import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';


@Component({
    selector: 'package-loader-packages',
    templateUrl: './src/systemcomponents/templates/packageloaderpackages.html',
})
export class PackageLoaderPackages {

    @Input() private packagescope = '';
    private packagefilterterm: string = '';

    @Input() private packages = [];
    @Input() private repository: any;

    constructor(
        private language: language
    ) {

    }
}
