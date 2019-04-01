/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'administration-configeditor',
    templateUrl: './src/admincomponents/templates/administrationconfigeditor.html'
})
export class AdministrationConfigEditor implements OnInit {

    componentconfig: any = {};
    configvalues: any = {};
    loading: boolean = true;


    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal
    ) {

    }

    ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('configurator/editor/' + this.componentconfig.category).subscribe(data => {
                this.configvalues = data;
                this.loading = false;
                modalRef.instance.self.destroy();
            })
        })

    }

    get items() {
        let items = [];

        for (let field of this.componentconfig.items) {
            if (field.hidden !== true)
                items.push(field);
        }

        return items;
    }

    save() {
        this.loading = true;
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.backend.postRequest('configurator/editor/' + this.componentconfig.category, [], this.configvalues).subscribe(data => {
                this.loading = false;
                modalRef.instance.self.destroy();
            })
        })
    }

}