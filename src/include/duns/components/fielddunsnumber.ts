/**
 * @module ModuleDuns
 */
import {Component, ViewContainerRef} from "@angular/core";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "field-duns-number",
    templateUrl: "./src/include/duns/templates/fielddunsnumber.html"
})
export class FieldDunsNumber extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                private backend: backend,
                private modal: modal,
                private ViewContainerRef: ViewContainerRef
    ) {
        super(model, view, language, metadata, router);
    }

    private openDunsModal() {
        this.modal.openModal('DunsNumberModal', true, this.ViewContainerRef.injector)
            .subscribe(modalRef => {
                this.getResults(modalRef);
                modalRef.instance.response.subscribe(res => {
                    if (res) this.value = res;
                });
            });
    }

    private getResults(modalRef) {
        let params = {
            name: this.model.data.summary_text,
            street: this.model.data.billing_address_street + ' ' + this.model.data.billing_address_hsnm,
            city: this.model.data.billing_address_city,
            postalcode: this.model.data.billing_address_postalcode,
            country: this.model.data.billing_address_country
        };
        modalRef.instance.isLoading = true;
        this.backend.getRequest('/SpiceDuns', params).subscribe(res => {
            if (res && res.length) {
                modalRef.instance.results = res;
                modalRef.instance.isLoading = false;
            }
        });
    }
}
