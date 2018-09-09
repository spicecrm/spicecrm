import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {footer} from "../../services/footer.service";
import {metadata} from "../../services/metadata.service";
import {toast} from "../../services/toast.service";

declare var _;

@Component({
    selector: 'reference-config-manager',
    templateUrl: './app/workbench/templates/referenceconfigmanager.html',
})
export class ReferenceConfigManager
{

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
        private toast: toast,
    ){

    }

}