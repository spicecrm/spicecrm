/**
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {territories} from '../../services/territories.service';

@Component({
    selector: 'object-record-details-tab',
    templateUrl: '../templates/objectrecordadministrationtab.html'
})
export class ObjectRecordAdministrationTab implements OnInit {

    public componentconfig: any = {};
    public expanded: boolean = true;
    public hasFieldAssignedUser = false;
    // public territorymanaged: boolean = false;

    public fields: any = {
        spiceacl_primary_territory: {
            field: 'spiceacl_primary_territory',
            fieldconfig: {}
        },
        spiceacl_territories_hash: {
            field: 'spiceacl_territories_hash',
            fieldconfig: {}
        },
        spiceacl_users_hash: {
            field: 'spiceacl_users_hash',
            fieldconfig: {}
        },
        assigned_user_name: {
            field: 'assigned_user_name',
            fieldconfig: {}
        },
        created_by_name: {
            field: 'created_by_name',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_entered'}
        },
        modified_by_name: {
            field: 'modified_by_name',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_modified'}
        }
    };

    constructor(public activatedRoute: ActivatedRoute, public metadata: metadata, public model: model, public language: language, public territories: territories) {
    }

    public ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }

        /*
        let fields = this.metadata.getModuleFields(this.model.module)
        {
            if (fields.spiceacl_primary_territory) {
                this.territorymanaged = true;
            }
        }
        */

        this.hasFieldAssignedUser = this.metadata.hasField(this.model.module, 'assigned_user_name');
    }

    /**
     * get the type settings for the territory from the territories service for the module
     */
    public getTypeParameters() {
        return this.territories.getModuleParamaters(this.model.module);
    }

    /**
     * a simple getter that returns true if the module is territory managed
     */
    get territorymanaged() {
        return this.territories.checkModuleManaged(this.model.module);
    }

    /**
     * simple getter to return if the current module manages multiple territories
     */
    get multipleterritories(){
        return this.getTypeParameters().multipleobjects == 1 ? true : false;
    }

    /**
     * simple getter to return if the current module manages multiple users
     */
    get multipleusers() {
        return this.metadata.getModuleDefs(this.model.module).acl_multipleusers == 1 ? true : false;
    }

    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

}
