import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';


@Component({
    selector: 'package-loader-packages',
    templateUrl: './src/workbench/templates/packageloaderpackages.html',
})
export class PackageLoaderPackages {

    private packagefilterterm: string = '';

    @Input() private packages = [];

    constructor(
        private language: language
    ) {

    }
}
