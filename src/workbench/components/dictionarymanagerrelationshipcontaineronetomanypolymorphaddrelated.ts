/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit, Input, Output, EventEmitter
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition,DictionaryItem, RelationshipPolymorph} from "../interfaces/dictionarymanager.interfaces";

/**
 * a modal to allow selction of a related module and id
 */
@Component({
    selector: 'dictionary-manager-relationship-container-onetomanypolymorph-addrelated',
    templateUrl: '../templates/dictionarymanagerrelationshipcontaineronetomanypolymorphaddrelated.html',
})
export class DictionaryManagerRelationshipContainerOneToManyPolymorphAddRelated implements OnInit{

    public self: any;

    public relationshipscope: 'g'|'c';
    public scope: 'g'|'c' = 'g';

    relationship_id: string;

    /**
     * package
     */
    package: string;

    /**
     * version
     */
    version: string;

    public _lhsRelatedId: string;
    public lhs_sysdictionaryitem_id: string;

    public lhs_items: DictionaryItem[] = []

    @Output() newrelated: EventEmitter<RelationshipPolymorph> = new EventEmitter<RelationshipPolymorph>();


    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
    }


    get relatedIds(): DictionaryDefinition[] {
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module').sort((a, b) => a.name.localeCompare(b.name));
    }


    get lhsRelatedId(){
        return this._lhsRelatedId
    }

    set lhsRelatedId(id){
        this._lhsRelatedId = id;
        this.lhs_sysdictionaryitem_id = '';
        this.lhs_items = this.dictionarymanager.getDictionaryDefinitionItems(id);
    }

    public ngOnInit() {
        this.scope = this.dictionarymanager.changescope == 'all' ? this.relationshipscope : 'c';
    }

    public save(){
        let rhsPoly: RelationshipPolymorph = {
            id: this.modelutilities.generateGuid(),
            relationship_id: this.relationship_id,
            lhs_sysdictionarydefinition_id: this._lhsRelatedId,
            lhs_sysdictionaryitem_id:this.lhs_sysdictionaryitem_id,
            scope: this.scope,
            package: this.package,
            version: this.version
        }
        this.newrelated.emit(rhsPoly);
        this.close();
    }

    public close(){
        this.self.destroy();
    }
}
