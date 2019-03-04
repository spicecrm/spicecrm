/**
 * @module ModuleSalesDocs
 */
import {Component, Input,  Pipe} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {session} from '../../../services/session.service';
import {configurationService} from '../../../services/configuration.service';
import {language} from '../../../services/language.service';

// pipe to filter the item itself and others that have a parent item already set
@Pipe({name: 'salesdocsitemsparentpipe', pure: false})
export class SalesDocsItemsParentPipe {
    transform(items, item) {
        let retValues = [];
        for(let thisItem of items){
            if (!thisItem.parentitem_id && thisItem.id != item.id)
                retValues.push(thisItem);
        }
        return retValues;
    }
}

@Component({
    selector: 'salesdocs-items-parent-selector',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsparentselector.html'
})
export class SalesDocsItemsParentSelector {

    @Input()items: Array<any> = [];
    @Input()item: any = undefined;

    constructor(private language: language, private metadata: metadata, private model: model, private configurationService: configurationService, private session: session) {
    }

    get isParent(){
        for(let item of this.items){
            if(item.parentitem_id == this.item.id){
                return true;
            }
        }
    }

}