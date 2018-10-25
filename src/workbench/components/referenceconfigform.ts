import {
    Component
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {BasicReferenceForm} from "./basicreferenceform";
import { toast } from '../../services/toast.service';

declare var _;

@Component({
    selector: 'reference-config-form',
    templateUrl: './src/workbench/templates/referenceconfigform.html',
})
export class ReferenceConfigForm extends BasicReferenceForm
{

    constructor(
        private language: language,
        protected backend: backend,
        private toast: toast
    ) {
        super(backend);
    }

    public test()
    {
        console.log(this.package_names, this.version_names);
    }

    get all_package_names()
    {
        return this.available_packages.map((item) => {return item.package});
    }

    public submit()
    {
        this.is_pulling = true;
        this.backend.getRequest(
            'configurator/load',
            {
                packages: this.package_names.toString(),
                versions: this.version_names.toString()
            }
        ).subscribe(
            result => {
                this.pull_result = JSON.stringify(result);
                this.is_pulling = false;
                //this.load$.emit(this.pull_result);
                this.toast.sendToast('Configuration data successful retrieved.', 'success' );
            },
            result => {
                console.error(result);
                this.pull_result = _.isObject(result) ? result.error.message : result;
                this.is_pulling = false;
                this.toast.sendToast('Error. Configuration data not retrieved.', 'error', result.error && result.error.error && result.error.error.message ? 'Message from REST api: '+result.error.error.message : null, false ) ;
            }
        );
    }
}