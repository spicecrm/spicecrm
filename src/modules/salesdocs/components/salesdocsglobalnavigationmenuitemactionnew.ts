/**
 * @module GlobalComponents
 */
import {
    Component,
    OnInit,
    Injector
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {GlobalNavigationMenuItemActionNew} from "../../../globalcomponents/components/globalnavigationmenuitemactionnew";

@Component({
    selector: 'global-navigation-menu-item-action-new',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitemactionnew.html'
})
export class SalesDocsGlobalNavigationMenuItemActionNew extends GlobalNavigationMenuItemActionNew implements OnInit {

    constructor(public language: language, public model: model, public metadata: metadata, private modal: modal, private injector: Injector) {
        super(language, model, metadata);
    }

    public execute() {
        let componentConfig = this.metadata.getComponentConfig('SalesdocsNewButton', this.model.module);

        this.model.id = "";
        this.model.initialize();
        this.modal.openModal(componentConfig.modalcomponent ? componentConfig.modalcomponent : 'SalesDocsAddBasics', true, this.injector);
    }

}
