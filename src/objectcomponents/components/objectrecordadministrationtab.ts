/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-details-tab',
    templateUrl: './app/objectcomponents/templates/objectrecordadministrationtab.html'
})
export class ObjectRecordAdministrationTab implements OnInit {

    componentconfig: any = {};
    expanded: boolean = true;
    territorymanaged: boolean = false;

    fields: any = {
        'spiceacl_primary_territory': {
            field: 'spiceacl_primary_territory',
            fieldconfig: {}
        },
        'spiceacl_territories_hash': {
            field: 'spiceacl_territories_hash',
            fieldconfig: {}
        },
        'assigned_user_name': {
            field: 'assigned_user_name',
            fieldconfig: {}
        },
        'created_by_name': {
            field: 'created_by_name',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_entered'}
        },
        'modified_by_name': {
            field: 'modified_by_name',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_modified'}
        }
    };

    constructor(private activatedRoute: ActivatedRoute, private metadata: metadata, private model: model, private language: language) {
    }

    ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }

        let fields = this.metadata.getModuleFields(this.model.module)
        {
            if (fields.spiceacl_primary_territory)
                this.territorymanaged = true;
        }

    }


    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

}