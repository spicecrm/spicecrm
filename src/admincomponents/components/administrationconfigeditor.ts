/**
 * @module AdminComponentsModule
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';

/**
 * a simple config editor that allows editing config settings for a specific subtree
 */
@Component({
    selector: 'administration-configeditor',
    templateUrl: '../templates/administrationconfigeditor.html'
})
export class AdministrationConfigEditor implements OnInit {

    /**
     * the config from the admin item in the settings
     */
    public componentconfig: any = {};

    /**
     * the values that are held and set
     */
    public configvalues: any = {};

    /**
     * an indicator if the config paramaters are loading
     */
    public loading: boolean = true;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal
    ) {

    }

    /**
     * loads the config settings
     */
    public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('configuration/configurator/editor/' + this.componentconfig.category).subscribe(data => {
                this.configvalues = data;
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });

    }

    /**
     * simnple getter to return the config items
     */
    get items() {
        let items = [];

        for (let field of this.componentconfig.items) {
            if (field.hidden !== true) items.push(field);
        }

        return items;
    }

    /**
     * the save function
     */
    public save() {
        this.loading = true;
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.backend.postRequest('configuration/configurator/editor/' + this.componentconfig.category, [], { config: this.configvalues }).subscribe(data => {
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }

}
