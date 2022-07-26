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
    public hasFieldAssignedOrgunit = false;
    public linkOrgunitToAssignedUser = true;

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
        assigned_user: {
            field: 'assigned_user',
            fieldconfig: {fieldtype:'linked'}
        },
        assigned_orgunit: {
            field: 'assigned_orgunit',
            fieldconfig: {}
        },
        created_by_user: {
            field: 'created_by_user',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_entered'}
        },
        modified_by_user: {
            field: 'modified_by_user',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_modified'}
        }
    };

    constructor(public metadata: metadata, public model: model, public territories: territories) {

    }

    public ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }

        if (this.componentconfig.unlinkorgunit) {
            this.linkOrgunitToAssignedUser = !this.componentconfig.unlinkorgunit;
        }

        // get what we have in terms of assignment
        this.hasFieldAssignedUser = this.metadata.hasField(this.model.module, 'assigned_user_id');
        this.hasFieldAssignedOrgunit = this.metadata.hasField(this.model.module, 'assigned_orgunit_id');

        // if we have an orgunit subscribe to the changes of the assigned user
        if(this.hasFieldAssignedOrgunit && this.linkOrgunitToAssignedUser) {
            this.model.data$.subscribe({
                next: (modeldata) => {
                    if (!!this.model.getField('assigned_user_id')) {
                        this.model._fields_stati.assigned_orgunit.readonly = true;
                        // check if we have another orgunit and if there is a change update it
                        if(this.model.getField('assigned_orgunit_id') != this.model.getField('assigned_user').orgunit_id){
                            this.model.setFields({
                                'assigned_orgunit_id': this.model.getField('assigned_user').orgunit_id,
                                'assigned_orgunit': this.model.getField('assigned_user').orgunit
                            }, true)
                        }
                    } else {
                        this.model._fields_stati.assigned_orgunit.readonly = false;
                    }
                }
            })
        }
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
