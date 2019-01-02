import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';


@Component({
    selector: 'package-loader-packages',
    templateUrl: './src/systemcomponents/templates/packageloaderpackages.html',
})
export class PackageLoaderPackages {

    private packagefilterterm: string = '';

    @Input() private packages = [];

    constructor(
        private language: language
    ) {

    }
}
