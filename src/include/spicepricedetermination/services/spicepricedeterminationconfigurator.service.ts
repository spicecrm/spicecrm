import {Injectable} from "@angular/core";
import {
    priceCalculationSchema, priceCalculationSchemaElement,
    priceConditionElement, priceConditionType, priceConditionTypeDetermination,
    priceDetermination,
    priceDeterminationElement
} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

declare var _: any;

@Injectable()
export class SpicePriceDeterminationConfiguratorService {

    /**
     * indicator that the service is loading
     */
    public loading: boolean = false;

    /**
     * holds a JSON of the laoded data for comparion and to detect changes
     * @private
     */
    private loadedData: string;

    /**
     * the curren selcted data
     */
    public selectedSchema: string = '';
    
    public backendMapping = [
        {backend: 'syspriceconditionelements', frontend: 'conditionElements'},
        {backend: 'syspriceconditiontypes', frontend: 'conditionTypes'},
        {backend: 'syspricedeterminations', frontend: 'determinations'},
        {backend: 'syspricedeterminationelements', frontend: 'determinationElements'},
        {backend: 'syspriceconditiontypesdeterminations', frontend: 'conditionTypeDeterminations'},
        {backend: 'syspricecalculationschemes', frontend: 'calculationSchemes'},
        {backend: 'syspricecalculationschemaelements', frontend: 'calculationSchemaElements'}
    ]

    /**
     * the various data stores
     */
    public conditionElements: priceConditionElement[] = [];
    public determinations: priceDetermination[] = [];
    public determinationElements: priceDeterminationElement[] = [];
    public conditionTypes: priceConditionType[] = [];
    public conditionTypeDeterminations: priceConditionTypeDetermination[] = [];
    public calculationSchemes: priceCalculationSchema[] = [];
    public calculationSchemaElements: priceCalculationSchemaElement[] = [];


    constructor(public backend: backend, public toast: toast) {

    }

    public initialize(){
        this.loading = true;
        this.backend.getRequest('configuration/pricedetermination').subscribe({
            next: (res) => {
                for(let mapped of this.backendMapping){
                    this[mapped.frontend] = res[mapped.backend];
                }


                this.loadedData = JSON.stringify(res);

                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.toast.sendToast('MSG_ERROR_LOADING_DATA', 'error');
            }
        })
    }

    public getValues(valueType: string, sorted: boolean = true){
        return this[valueType].filter(r => r.deleted !== true).sort((a, b) => {
            if(!a.name) return 1;
            if(!b.name) return -1;
            return a.name.localeCompare(b.name);
        })
    }

    /**
     * detect if we have changes
     */
    get changed(){
        let current: any = {};
        for(let mapped of this.backendMapping){
            current[mapped.backend] = this[mapped.frontend];
        }
        return this.loadedData && JSON.stringify(current) != this.loadedData;
    }

    /**
     * save the changed data
     */
    public save(){
        this.loading = true;
        this.backend.postRequest('configuration/pricedetermination', {}, this.getChanges()).subscribe({
            next: (res) => {
                this.initialize();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.toast.sendToast('MSG_ERROR_SAVING_DATA', 'error');
            }
        })
    }

    /**
     * get all changed records
     */
    public getChanges(){
        let changed: any = {};
        let loaded = JSON.parse(this.loadedData);
        for(let mapped of this.backendMapping){
            // set a changed object
            changed[mapped.backend] = {new: [], changed: [], deleted:[]};

            // loop over al records
            for(let r of this[mapped.frontend]){
                if(r.deleted){
                    // check if the record existed or waws added and deleted
                    if(loaded[mapped.backend].find(br => br.id == r.id)) {
                        changed[mapped.backend].deleted.push(r.id);
                    }
                    continue;
                }

                let b = loaded[mapped.backend].find(br => br.id == r.id);
                if(!b){
                    changed[mapped.backend].new.push(r);
                } else {
                    if(JSON.stringify(r) != JSON.stringify(b)){
                        changed[mapped.backend].changed.push(r);
                    }
                }
            }

            // unset all empty records
            if(changed[mapped.backend].new.length == 0) delete(changed[mapped.backend].new);
            if(changed[mapped.backend].changed.length == 0) delete(changed[mapped.backend].changed);
            if(changed[mapped.backend].deleted.length == 0) delete(changed[mapped.backend].deleted);
            if(_.keys(changed[mapped.backend]).length == 0) delete(changed[mapped.backend]);
        }

        return changed;
    }
}
