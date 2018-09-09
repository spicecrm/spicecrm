import {
    Component
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {BasicReferenceForm} from "./basicreferenceform";
import {toast} from "../../services/toast.service";

declare var _;

@Component({
    selector: 'language-label-reference-config-form',
    templateUrl: './src/workbench/templates/languagelabelreferenceconfigform.html',
})
export class LanguageLabelReferenceConfigForm extends BasicReferenceForm
{
    language_names:string;

    constructor(
        protected utils: modelutilities,
        protected language: language,
        protected backend: backend,
        private toast: toast,
    ){
        super(backend);
    }

    submit()
    {
        this.is_pulling = true;
        this.backend.getRequest(
            `/reference/load/languages/${this.language_names}`,
            {
                version: this.version_names.toString()
            }
        ).subscribe(
            result => {
                this.pull_result = JSON.stringify(result);
                this.is_pulling = false;
                //this.load$.emit(this.pull_result);
            },
            result => {
                console.error(result);
                this.pull_result = _.isObject(result) ? result.error.message : result;
                this.is_pulling = false;
                this.toast.sendToast('Error. Labels not retrieved.', 'error', result.error && result.error.error && result.error.error.message ? 'Message from REST api: '+result.error.error.message : null, false ) ;
            }
        );
    }
}