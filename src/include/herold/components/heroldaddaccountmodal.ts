import {Component, Injector, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";

declare var moment: any;

@Component({
    selector: 'herold-add-account-modal',
    templateUrl: '../templates/heroldaddaccountmodal.html',
    providers: [model]
})
export class HeroldAddAccountModal implements OnInit{

    public self: any;

    public searchterm: string = '';
    public searchpostalcode: string = '';

    public total = '0';

    public page: 1;
    public pages: 1

    public selectedSID: string;
    public items: any[] = [];

    private treeid: string;

    constructor(
        private model: model,
        private modal: modal,
        private injector: Injector,
        private backend: backend,
        private toast: toast,
        public config: configurationService,
        public metadata: metadata

    ) {}

    /**
     * load the treedata
     */
    public ngOnInit() {
        // get the categories
        let categories = this.config.getData('categories');

        // first try to determine by module
        let moduleDefs = this.metadata.getModuleDefs("Accounts");

        if(moduleDefs.categorytrees){
            let r = moduleDefs.categorytrees.find(t => t.module_field == 'sic_code');
            if(r) {
                this.treeid = r.syscategorytree_id;
            }
        }

        if (this.treeid && (!categories || !categories[this.treeid])) {
            if (!categories) categories = {};
            // set this in any case so we don't load multiple times
            categories[this.treeid] = [];
            this.config.setData('categories', categories);

            // load all categories which are needed to display the choosen categories...
            this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.treeid}/categorytreenodes`).subscribe(
                (res: any) => {
                    categories[this.treeid] = res;
                    this.config.setData('categories', categories);
                }
            );
        }
    }

    public search(firstPage = true){
        let runningSearchModal = this.modal.await('LBL_SEARCHING');

        // got to first page
        if(firstPage) this.page = 1;

        // reset the selected SID
        this.selectedSID = undefined;

        this.items = [];
        this.backend.postRequest('common/herold', {}, {searchterm: this.searchterm, searchpostalcode: this.searchpostalcode, page: this.page}).subscribe({
            next: (res) => {
                if(res) {
                    this.items = res.items;
                    this.total = res.count;
                    this.pages = res.pageCount;
                }
                runningSearchModal.emit(true);
            },
            error: (e) => {
                this.toast.sendToast(e.error.error.message, 'warning', null, 5);
                runningSearchModal.emit(true);
            }
        })
    }

    public next(){
        this.page++;
        this.search(false);
    }
    public prev(){
        this.page--;
        this.search(false);
    }

    public select(item){
        this.selectedSID = item.sid;
    }

    public create(company: any = null){

        if(!company){
            company = this.items.find(i => i.sid == this.selectedSID);
        }

        if(!company) return;

        this.model.module = 'Accounts';
        this.model.id = undefined;
        this.model.initialize();

        // set the presets
        let presets: any = {
            name: company.name,
            billing_address_street: company.street,
            billing_address_street_number: company.houseNumber,
            billing_address_city: company.city.name,
            billing_address_district: company.district.name,
            billing_address_country: 'AT',
            billing_address_postalcode: company.postalCode,
            billing_address_latitude: company.geoLat,
            billing_address_longitude: company.geoLong,
            website: company.mainWebsite,
            vat_nr: company.vatNumber,
            employees: company.employeeCount,
            herold_id: company.sid,
            herold_date: moment(),
            herold_data: JSON.stringify(company)
        }

        // add an email if we have one
        if(company.mainEmail){
            presets.email1 = company.mainEmail,
            this.model.addRelatedRecords('email_addresses', [{
                id: this.model.utils.generateGuid(),
                email_address:company.mainEmail,
                invalid_email: 0,
                primary_address: 1
            }])
            presets.email_addresses = {...this.model.data.email_addresses};
        }

        // check if we have a phone number
        if(company.mainPhoneNumber){
            presets.phone_office = '+43 ('+ company.mainPhoneNumber.prefix + ') ' + company.mainPhoneNumber.number
        }

        // check if we have company revenue
        if(company.revenues){
            presets.annual_revenue = company.revenues[0].revenue;
        }

        // map the OENACE Codes
        // todo.. make this nicer and more flexible
        if(this.treeid && company.oenaceIndustries) {
            let categories = this.config.getData('categories')[this.treeid];

            let industry = company.oenaceIndustries[0].id.substring(0, 3);
            let category = categories.find(c => c.node_key.substring(1) == industry);
            if(category){
                presets.sic_code_1 = category.node_key.substring(0, 1);
                presets.sic_code_2 = category.node_key.substring(0, 3);
                presets.sic_code_3 = category.node_key.substring(0, 4);
            }
        }


        this.model.addModel('', null, presets);

        this.self.destroy();
    }


    public close(){
        this.self.destroy();
    }


}
