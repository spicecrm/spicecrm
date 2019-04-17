/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    OnChanges,
    Input, OnInit, Output, EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {modelutilities} from '../../../services/modelutilities.service';


@Component({
    selector: 'aclterritorries-manager-territory-add-modal',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritoryaddmodal.html',
    providers: [model, view]
})
export class ACLTerritorriesManagerTerritoryAddModal implements OnInit {

    self: any = {};
    @Input() territorytype: string = '';
    territorrytypedetails: any = {};
    @Output() newterritory: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private model: model, private view: view, private language: language, private modelutilities: modelutilities, private toast: toast) {
        this.model.module = 'SpiceACLTerritories';
        this.model.id = this.modelutilities.generateGuid();
        this.model.initialize();

        this.model.data.id = this.model.id;
        this.model.data.inactive = 1;
        this.model.data.usagecount = 0;

        // set the view
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        // set type
        this.model.data.territortype_id = this.territorytype;

        // load type
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes/' + this.territorytype).subscribe(territorrytypedetails => {
            this.model.data.elementvalues = {};
            for(let element of territorrytypedetails.elements){
                this.model.data.elementvalues[element.id] = {
                    spiceaclterritoryelement_id: element.id,
                    elementvalue: '',
                    elementdescription: '',
                    name: element.name
                };
            }

            this.territorrytypedetails = territorrytypedetails;

        })
    }

    get addDisabled(){
        if(!this.model.data.name){
            return true;
        }

        if(!this.model.data.elementvalues)
            return true;

        for(let elementvalue in this.model.data.elementvalues){
            if(this.model.data.elementvalues[elementvalue].elementvalue == '')
                return true;
        }

        return false;
    }

    close(){
        this.self.destroy();
    }

    save(){
        this.backend.postRequest('spiceaclterritories/core/territories/check', {}, this.modelutilities.spiceModel2backend('SpiceACLTerrtories', this.model.data)).subscribe(response => {
            if(response.status == 'success'){
                this.backend.postRequest('spiceaclterritories/core/territories/'+this.model.id, {}, this.modelutilities.spiceModel2backend('SpiceACLTerrtories', this.model.data)).subscribe(response => {
                    this.newterritory.emit(this.model.data);
                    this.close();
                });

            } else {

            }
        });


    }

}