/**
 * @module GlobalComponents
 */
import {Component, OnInit, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {GlobalNavigationMenuItemActionNew} from "../../../globalcomponents/components/globalnavigationmenuitemactionnew";

declare var _: any;

@Component({
    selector: 'global-navigation-menu-item-action-new',
    templateUrl: '../../../globalcomponents/templates/globalnavigationmenuitemactionnew.html'
})
export class ProcurementDocsGlobalNavigationMenuItemActionNew extends GlobalNavigationMenuItemActionNew implements OnInit {

    public actionconfig: any = {};

    constructor(public language: language, public model: model, public metadata: metadata, public modal: modal, public injector: Injector) {
        super(language, model, metadata);
    }

    public execute() {
        if (_.isEmpty(this.actionconfig)) {
            this.actionconfig = this.metadata.getComponentConfig('ProcurementDocsNewButton', this.model.module);
        }

        this.model.id = "";
        this.model.initialize();

        if (this.actionconfig.defaultprocurementdoctype) {
            this.model.setField('procurementdoctype', this.actionconfig.defaultprocurementdoctype);
        }

        this.modal.openModal(this.actionconfig.modalcomponent ? this.actionconfig.modalcomponent : 'ProcurementDocsAddBasics', true, this.injector);
    }

}
