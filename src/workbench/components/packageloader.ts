import {
    Component
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {BasicReferenceForm} from "./basicreferenceform";
import {toast} from '../../services/toast.service';

declare var _;

@Component({
    selector: 'package-loader',
    templateUrl: './src/workbench/templates/packageloader.html',
})
export class PackageLoader {

    constructor(
        private language: language,
        protected backend: backend,
        private toast: toast
    ) {

    }

}
