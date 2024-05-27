/**
 * @module ModuleSpiceAccountDetermination
 */
import {
    Component, OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {Md5} from "ts-md5";

declare var moment: any;

/**
 * a modalto set prices on a module
 */
@Component({
    selector: 'spice-account-determination-manager',
    templateUrl: '../templates/spiceaccountdeterminationmanager.html',
    providers: [model]
})
export class SpiceAccountDeterminationManager implements OnInit{

    /**
     * reference to the modal itself
     */
    public self: any;

    public determinationTypes: any[] = [];
    public _determinationType: string = '';

    public determinations: any[] = [];

    public _determination: string = '';

    public loadeddeterminationrecords: string = '';
    public determinationrecords: any[] = [];

    constructor(public backend: backend, public modal: modal, public modelutilities: modelutilities) {

    }

    public ngOnInit() {
        this.loadeterminationTypes();
    }

    public loadeterminationTypes(){
        this.backend.getRequest(`common/accountdetermination/determinationtypes`).subscribe({
            next: (res) => {
                this.determinationTypes = res.determinationtypes;
                this.determinations = res.determinations;
            }
        })
    }

    get determinationType(){
        return this._determinationType;
    }

    set determinationType(ct){
        this._determinationType = ct;
        this.determination = '';
    }

    get determination(){
        return this._determination;
    }

    set determination(dt){
        this._determination = dt;
        // if we have a value
        if(dt) {
            this.loadDeterminationRecords()
        } else {
            this.determinationrecords = [];
            this.loadeddeterminationrecords = '';
        }
    }

    /**
     * return the type elements
     */
    get determinationElements(){
        return this._determination ? this.determinations.find(d => d.id == this._determination).elements : [];
    }

    /**
     * loads the condition records
     */
    public loadDeterminationRecords(){
        this.determinationrecords = [];
        let awaitModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`common/accountdetermination/conditions/${this.determinationType}/${this.determination}`).subscribe({
            next: (res) => {
                this.loadeddeterminationrecords= JSON.stringify(res);
                this.determinationrecords = res;
                awaitModal.emit(true);
            },
            error: () => {
                awaitModal.emit(true);
            }
        })
    }

    public addDetermination(){
        this.determinationrecords.push({
            id: this.modelutilities.generateGuid(),
            sysaccountdetermination_id: this.determination,
            sysaccountdterminationtype_id: this.determinationType,
            sysaccountdtermination_hash: undefined,
            deleted: 0,
            accountnr: '',
            element_values: {}
        });
    }

    public getElementValue(determinationrecordid, elementname, loaded = false){
        return this.determinationrecords.find(c => c.id == determinationrecordid).element_values[elementname];
    }

    public setElementValue(determinationrecordid, elementname, value){
        let r = this.determinationrecords.find(c => c.id == determinationrecordid);
        if(!r.element_values) r.element_values = {};
        r.element_values[elementname] = value;

        // build the md5 hash
        let hasAllValues = true;
        let hashstring = '';
        let elements = this.determinations.find(d => d.id == this.determination).elements;
        for(let element of elements){
            if(!r.element_values[element.name]) {
                hasAllValues = false;
            } else {
                hashstring += r.element_values[element.name];
            }
        }
        r.sysaccountdtermination_hash = hasAllValues ? Md5.hashStr(hashstring) : undefined;
    }

    public saveDeterminations(){
        let changedRecords = [];
        for(let r of this.determinationrecords){
            let er = JSON.parse(this.loadeddeterminationrecords).find(lr => lr.id == r.id);
            if(er){
                if(JSON.stringify(r) !== JSON.stringify(er)) changedRecords.push(r);
            } else {
                changedRecords.push(r);
            }
        }

        // post to the backend
        let awaitmodal = this.modal.await('LBL_SAVING');
        this.backend.postRequest(`common/accountdetermination/conditions/${this.determinationType}/${this.determination}`, {}, changedRecords).subscribe({
            next: (res) => {
                awaitmodal.emit(true);
            },
            error: () => {
                awaitmodal.emit(true);
            }
        })

    }

    get typeDeterminations(){
        let determinations = [];

        if(!this.determinationType) return determinations;

        // push the determinations
        for(let cdt of this.determinationTypes.find(t => t.id == this.determinationType).determinations){
            let dt =this.determinations.find(d => d.id == cdt.sysaccountdtermination_id);
            if(dt) determinations.push(dt);
        }


        return determinations;
    }

    public deleteRecord(record){
        if(JSON.parse(this.loadeddeterminationrecords).find(r => r.id == record.id)){
            record.deleted = 1;
        } else {
            this.determinationrecords.splice(this.determinationrecords.findIndex(r => r.id == record.id), 1)
        }
    }

    /**
     * check that we have changes and all is complete
     */
    public hasChanges(){
        return !!this.loadeddeterminationrecords && this.loadeddeterminationrecords != JSON.stringify(this.determinationrecords) && this.determinationrecords.filter(r => !r.sysaccountdtermination_hash).length == 0 && this.determinationrecords.filter(r => !r.accountnr).length == 0;
    }

    public close(){
        this.self.destroy();
    }

}
