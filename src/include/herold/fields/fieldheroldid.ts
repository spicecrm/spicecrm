/**
 * @module ModuleSpiceAttachments
 */
import {
    Component, Injector
} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {modal} from "../../../services/modal.service";


/**
 * renders a field to upload files in a model itself
 */
@Component({
    templateUrl: '../templates/fieldheroldid.html'
})
export class fieldHeroldId extends fieldGeneric {


    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public injector: Injector,
        public modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    get hasHeroldData(){
        return !!this.model.getField('herold_data');
    }

    public completeAccount(){
        this.modal.openModal('HeroldCompleteAccountModal', true, this.injector);
    }

}
