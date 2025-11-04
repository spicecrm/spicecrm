/**
 * @module ModuleAccounts
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";

declare var _: any;

@Component({
    templateUrl: '../templates/accountterritorydetails.html',
    standalone: false
})
export class AccountTerritoryDetails implements OnInit {
    public companyCodes: any[] = [];
    public activatedTabs: any[] = [];
    public activeTab: number = 0;
    public isLoading: boolean = false;

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public backend: backend,
                public metadata: metadata,
                public toast: toast,
                public view: view) {

    }

    public ngOnInit() {
        this.view.isEditable = true;
    }

    get canDelete(){
        return this.getCCDetails()[this.activeTab]?.acl.delete;
    }

    /*
    * set the Active Tab
    * @param index Tab Index
    * @return void
    * */
    public setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    public getCCDetails(): any {
        return this.model.data?.accountccdetails?.beans ? _.toArray(this.model.data.accountccdetails.beans) : [];
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    public getCCDetailsData(cc): any {
        let beans = this.model.data.accountccdetails.beans;
        for (let bean in beans) {
            if (beans.hasOwnProperty(bean) && beans[bean].companycode_id == cc.id) {
                return beans[bean];
            }
        }
    }


    /*
    * @param index
    * @param item
    * @return index|item
    * */
    public trackByFn(index, item) {
        return index;
    }

    /**
     * deletes the acc detail record
     */
    public deleteACCDetail(){
        if(this.canDelete){
            this.modal.prompt('confirm', 'LBL_DELETE_ACCOUNTCCDETAIL','LBL_DELETE_RECORD').subscribe({
                next: (res) => {
                    if(res){
                        let record = this.getCCDetails()[this.activeTab];
                        let awaitModal = this.modal.await('LBL_DELETING');
                        this.backend.deleteRequest(`module/AccountCCDetails/${record.id}`).subscribe({
                            next: () => {
                                delete this.model.data.accountccdetails.beans[record.id];
                                if(this.getCCDetails().length > 0){
                                    this.activeTab = 0;
                                } else {
                                    this.activeTab = null;
                                }
                                awaitModal.emit(true);
                            },
                            error: (e) => {
                                this.toast.sendToast('LBL_ERROR_DELETING_RECORD', 'error');
                                awaitModal.emit(true);
                            }
                        })
                    }
                }
            })
        }
    }
}
