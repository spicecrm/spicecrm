/**
 * @module ObjectComponents
 */
import { Component, AfterViewInit, OnInit, OnDestroy, ViewChildren, QueryList, Input } from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {ObjectRelatedList} from './objectrelatedlist';

@Component({
    selector: "object-relatedlist-list",
    templateUrl: "../templates/objectrelatedlistlist.html",
    providers: [relatedmodels]
})
export class ObjectRelatedlistList extends ObjectRelatedList {

    get hide(){
        return this.componentconfig.hideempty && this.relatedmodels.count == 0;
    }

    /**
     * a getter for the Title to be displayed. This either translates a tilte if set int he config or it renders the module name
     */
    get panelTitle() {
        if ( this.componentconfig.title ) return this.language.getLabel( this.componentconfig.title );
        if ( this.relatedmodels._linkName && this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName] && this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName].vname ) {
            return this.language.getLabel( this.metadata.fieldDefs[this.relatedmodels.module][this.relatedmodels._linkName].vname );
        }
        return this.language.getModuleName( this.relatedmodels.module );
    }
}
