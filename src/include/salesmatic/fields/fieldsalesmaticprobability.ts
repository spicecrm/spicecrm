import {Component, OnChanges, OnInit} from "@angular/core";
import {fieldToggle} from "../../../objectfields/components/fieldtoggle";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import reset = _default.reset;

@Component({
    selector: 'field-salesmatic-probability',
    templateUrl: '../templates/fieldsalesmaticprobability.html',

})
export class fieldSalesmaticProbability extends fieldGeneric implements OnInit{

    private _value = 0;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend
    ) {
        super(model, view, language, metadata, router);
    }

    get value(){
        return this._value;
    }

    public ngOnInit() {
        super.ngOnInit();

        this.backend.getRequest(`/module/SalesDocuments/${this.model.id}/salesmatic/probability`).subscribe({
            next: (res) => {
                this._value = 88;
            }
        })
    }
}