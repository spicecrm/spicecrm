/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {domainmanager} from '../services/domainmanager.service';
import {field} from "../../objectfields/components/field";
import {view} from "../../services/view.service";

/**
 * a tab with details on a domain field
 */
@Component({
    selector: 'domain-manager-field-details',
    templateUrl: '../templates/domainmanagerfielddetails.html',
    providers: [view]
})
export class DomainManagerFieldDetails implements OnInit{

    public self: any;

    /**
     * the field itself
     */
    public field: any = {};

    public _field: any = {};

    constructor(public backend: backend, public metadata: metadata, public language: language, public domainmanager: domainmanager) {

    }

    public ngOnInit() {
        this._field = JSON.parse(JSON.stringify(this.field));
    }

    /**
     * getter for required since that is returned as int and not as boolean
     */
    get required() {
        return this.field.required == '1' ? true : false;
    }

    /**
     * setter for teh required checkbox to convert from boolean to tyniint
     *
     * @param isrequired
     */
    set required(isrequired) {
        this.field.required = isrequired ? '1' : '0';
    }

    /**
     * saves & closes the modal
     */
    public save(){
        this.backend.postRequest(`dictionary/domainfield/${this._field.id}`, {}, this._field).subscribe({
            next: (res) => {
                Object.getOwnPropertyNames(this._field).forEach(p => {
                    this.field[p] = this._field[p];
                })

                this.close();
            }
        });
        this.self.destroy();
    }


    /**
     * closes the modal
     */
    public close(){
        this.self.destroy();
    }

    /**
     * sets the version for domainfields
     * @param version
     */
    public setVersion(version: {name: string;}) {
        this._field.version = version?.name;
    }

    /**
     * sets the package for domainfields
     * @param packageData
     */
    public setPackage(packageData: {name: string;}) {
        this._field.package = packageData?.name;
    }
}
