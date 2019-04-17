/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';


@Component({
    selector: 'administration-ftsmanager-fields-add',
    templateUrl: './src/admincomponents/templates/administrationftsmanagerfieldsadd.html'
})
export class AdministrationFTSManagerFieldsAdd {

    @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

    path: Array<any> = [];
    links: Array<any> = [];
    fields: Array<any> = [];
    selectedFields: any = {};

    constructor(private metadata: metadata, private language: language, private ftsconfiguration: ftsconfiguration, private backend: backend, private modelutilities: modelutilities) {
        this.path.push({
            type: 'root',
            module: this.ftsconfiguration.module,
            path: 'root:' + this.ftsconfiguration.module
        });
        this.getLinks();
        this.getFields();
    }

    chooseBreadcrumb(i) {
        this.path = this.path.slice(0, i + 1);
        this.getLinks();
        this.getFields();
    }

    getLinks() {
        this.links = [];
        this.backend.getRequest('ftsmanager/core/nodes', {
            node: 'root',
            nodeid: this.buildNodeid()
        }).subscribe(links => {
            this.links = links;
        });
    }

    setLink(link) {
        this.path.push(link);
        this.getLinks();
        this.getFields();
    }

    getFields() {
        this.fields = [];
        this.backend.getRequest('ftsmanager/core/fields', {nodeid: this.buildNodeid()}).subscribe(fields => {
            let nodeid = this.buildNodeid();
            for (let field of fields) {
                if (this.ftsconfiguration.searchPath(nodeid + '::field:' + field.name)) {
                    field.exists = true;
                }

                this.fields.push(field);
            }
        });
    }

    buildNodeid() {
        let nodeArray = [];
        for (let path of this.path) {
            nodeArray.push(path.path);
        }
        return nodeArray.join('::');
    }

    getFieldLabel(field) {
        let path = this.path[this.path.length - 1].path.split(':');
        return this.language.getFieldDisplayName(path[1], field);
    }

    selectField(field) {
        if (this.selectedFields[this.buildNodeid() + '::field:' + field.name])
            delete(this.selectedFields[this.buildNodeid() + '::field:' + field.name]);
        else {
            let displaypath = '';
            for(let path of this.path){
                if(displaypath != '') displaypath += '->';
                displaypath += path.module;
            }
            field.displaypath = displaypath;
            field.fieldname = field.name;
            field.name = this.getFieldLabel(field.name);

            this.selectedFields[this.buildNodeid() + '::field:' + field.fieldname] = field;
        }
    }

    fieldSelected(fieldname) {
        return this.selectedFields[this.buildNodeid() + '::field:' + fieldname] ? true : false;
    }


    canSave(){
        let itemcount = 0;
        for(let field in this.selectedFields){
            itemcount++;
        }
        return itemcount > 0 ? true : false;
    }


    close() {
        this.closeModal.emit(false);
    }

    save(){
        for(let field in this.selectedFields){
            let fieldid = this.modelutilities.generateGuid();

            let fieldpath = '';
            let fieldpathitems = field.split('::');
            for(let fieldpathitem of fieldpathitems){
                let fieldpathitemelements = fieldpathitem.split(':');
                if(fieldpathitemelements && fieldpathitemelements.length === 3){
                    fieldpath += fieldpathitemelements[2] + '->'
                }
            }

            this.ftsconfiguration.moduleFtsFields.push({
                id: fieldid,
                fieldid: fieldid,
                fieldname: this.selectedFields[field].fieldname,
                name: this.selectedFields[field].name,
                indexfieldname: fieldpath + this.selectedFields[field].fieldname,
                displaypath: this.selectedFields[field].displaypath,
                path: field,
                search: true,
                indextype: 'string',
                index: 'analyzed'
            })
        }
        this.closeModal.emit(true)
    }
}

