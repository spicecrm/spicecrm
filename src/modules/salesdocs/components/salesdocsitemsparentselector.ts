/**
 * @module ModuleSalesDocs
 */
import {Component, Input, Pipe} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {session} from '../../../services/session.service';
import {configurationService} from '../../../services/configuration.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'salesdocs-items-parent-selector',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsparentselector.html'
})
export class SalesDocsItemsParentSelector {

    @Input() private items: any[] = [];
    @Input() private item: any = undefined;

    constructor(private language: language, private metadata: metadata, private model: model, private configurationService: configurationService, private session: session) {
    }

    get isParent() {
        for (let item of this.items) {
            if (item.parentitem_id == this.item.id) {
                return true;
            }
        }
    }

}