import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';


@Component({
    selector: 'package-loader-languages',
    templateUrl: './src/workbench/templates/packageloaderlanguages.html',
})
export class PackageLoaderLanguages {

    @Input() private languages = [];

}
