import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {ACManagerService} from "../services/acmanager.service";

@Component({
    selector: 'accounts-contacts-manager',
    templateUrl: './app/modules/accounts/templates/accountscontactsmanager.html',
    providers: [relatedmodels, ACManagerService]
})
export class AccountsContactsManager implements AfterViewInit, OnDestroy {

    editcomponentset: string = '';
    module: string = '';
    displayitems: number = 5;
    activeContactId: string = undefined;

    constructor(private language: language,
                private metadata: metadata,
                private relatedmodels: relatedmodels,
                private acmService: ACManagerService,
                private model: model) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
    }

    setActiveContactId(id){
        this.activeContactId = id;
    }


    get childrenHeight() {
        return {'height': '340px'};
    }

    get mainStyle() {
        return {
            'height': '350px' + 'px',
            'border-radius': '.25rem',
            'border': '1px solid #dddbda'
        }
    }

    ngAfterViewInit() {
        this.loadRelated();
    }

    loadRelated() {
        this.relatedmodels.relatedModule = 'Contacts';
        this.relatedmodels.getData();
    }

    ngOnDestroy() {
        // need to stop all subscrptions on my service
        this.relatedmodels.stopSubscriptions();
    }

    aclAccess() {
        return this.metadata.checkModuleAcl(this.module, 'list');
    }
}