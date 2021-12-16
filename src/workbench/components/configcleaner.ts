/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'language-label-manager',
    templateUrl: '../templates/configcleaner.html',
})
export class ConfigCleaner
{
    results: any = [];
    is_loading = false;

    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public utils: modelutilities,
    ){

    }

    diagnose(type:string)
    {
        this.is_loading = true;
        this.backend.getRequest(`admin/cleanup/configs/check/${type}`).subscribe(
            res => {
                this.results = res;
                this.is_loading = false;
            }
        );
    }

}
