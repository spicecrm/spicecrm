/**
 * @module ModuleAccounts
 */
import {
    Component,
    ViewChild,
    Input,
    OnChanges,
    AfterViewInit,
    ViewContainerRef
} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {ACManagerService} from '../services/acmanager.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'accounts-contacts-manager-details',
    templateUrl: '../templates/accountscontactsmanagerdetails.html',
    providers: [model, view]
})
export class AccountsContactsManagerDetails implements AfterViewInit, OnChanges {

    @ViewChild('detailscontainer', {read: ViewContainerRef, static: true}) detailscontainer: ViewContainerRef;
    @Input('activecontactid') activeContactId: string = undefined;
    renderedComponents: Array<any> = [];

    constructor(public language: language,
                public metadata: metadata,
                public view: view,
                public acmService: ACManagerService,
                public relatedmodels: relatedmodels,
                public model: model) {
        this.model.module = 'Contacts';
    }

    ngAfterViewInit() {
        this.buildContainer();
    }

    ngOnChanges() {
        if (this.activeContactId) {
            this.resetView();
            this.buildContainer();
            this.view.setViewMode();
            this.model.id = this.activeContactId;
            this.model.getData(true, '', true)
                .subscribe(data => {
                    if (!_.isEmpty(data.contactccdetails.beans)) {
                        this.acmService.contactCCDetails = data.contactccdetails.beans;
                    } else {
                        this.acmService.contactCCDetails = {};
                    }
                });
        }
    }

    resetView(){
        for(let renderedComponent of this.renderedComponents){
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    buildContainer() {
        let componentconfig = this.metadata.getComponentConfig('AccountsContactsManager', 'Accounts');
        let componentSet = componentconfig.detailscomponentset;

        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.detailscontainer).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }
}
