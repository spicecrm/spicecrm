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

/**
 * part of the territories manager displaying an add modal
 */
@Component({
    selector: 'aclterritorries-manager-territory-add-modal',
    templateUrl: '../templates/aclterritorriesmanagerterritoryaddmodal.html',
    providers: [model, view]
})
export class ACLTerritorriesManagerTerritoryAddModal implements OnInit {

    /**
     * reference to the component rendered
     */
    public self: any;

    /**
     * the territory type to be created
     */
    @Input() public territorytype: string = '';

    /**
     * the territory details
     */
    public territorrytypedetails: any = {};

    /**
     * an event emitter top emit when a new territory is created
     */
    @Output() public newterritory: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public modal: modal, public model: model, public view: view, public language: language, public modelutilities: modelutilities, public toast: toast) {
        // initialize the model
        this.initializeModel();

        // initialize the view
        this.initializeView();
    }

    /**
     * set initial view paramaters
     */
    public initializeView() {
        // set the view
        this.view.isEditable = true;
        this.view.displayLabels = false;
        this.view.setEditMode();
    }

    /**
     * setmodel attributes and initialize den m,odel
     */
    public initializeModel() {
        this.model.module = 'SpiceACLTerritories';
        this.model.id = this.modelutilities.generateGuid();
        this.model.initialize();

        this.model.data.inactive = 1;
        this.model.data.usagecount = 0;
    }

    public ngOnInit() {
        // set type
        this.model.data.territorytype_id = this.territorytype;

        // load type
        this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes/' + this.territorytype).subscribe(territorrytypedetails => {
            this.model.data.elementvalues = {};
            for (let element of territorrytypedetails.elements) {
                this.model.data.elementvalues[element.id] = {
                    spiceaclterritoryelement_id: element.id,
                    elementvalue: '',
                    elementdescription: '',
                    name: element.name
                };
            }

            this.territorrytypedetails = territorrytypedetails;

        });
    }

    get addDisabled() {
        if (!this.model.data.name) {
            return true;
        }

        if (!this.model.data.elementvalues) {
            return true;
        }

        for (let elementvalue in this.model.data.elementvalues) {
            if (this.model.data.elementvalues[elementvalue].elementvalue == '') {
                return true;
            }
        }

        return false;
    }

    public close() {
        this.self.destroy();
    }

    public save() {
        this.backend.postRequest('module/SpiceACLTerritories/' + this.model.id + '/check', {}, this.modelutilities.spiceModel2backend('SpiceACLTerrtories', this.model.data)).subscribe(response => {
            if (response.status == 'success') {
                this.backend.postRequest('module/SpiceACLTerritories/' + this.model.id, {}, this.modelutilities.spiceModel2backend('SpiceACLTerrtories', this.model.data)).subscribe(response => {
                    this.newterritory.emit(this.model.data);
                    this.close();
                });
            }
        });
    }
}
