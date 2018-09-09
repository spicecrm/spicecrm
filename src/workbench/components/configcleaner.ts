import {
    Component, Pipe, PipeTransform,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {footer} from "../../services/footer.service";
import { modal } from '../../services/modal.service';

@Component({
    selector: 'language-label-manager',
    templateUrl: './src/workbench/templates/configcleaner.html',
})
export class ConfigCleaner
{
    results = [];
    is_loading = false;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
    ){

    }

    diagnose(type:string)
    {
        this.is_loading = true;
        this.backend.getRequest(`/cleanup/configs/check/${type}`).subscribe(
            res => {
                console.log(res);
                this.results = res;
                this.is_loading = false;
            }
        );
    }

}