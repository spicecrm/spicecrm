/**
 * @module ModuleProcurementDocs
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {session} from '../../../services/session.service';
import {configurationService} from '../../../services/configuration.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'procurement-docs-items-parent-selector',
    templateUrl: '../templates/procurementdocsitemsparentselector.html'
})
export class ProcurementDocsItemsParentSelector {

    @Input() public items: any[] = [];
    @Input() public item: any = undefined;

    constructor(public language: language, public metadata: metadata, public model: model, public configurationService: configurationService, public session: session) {
    }

    get isParent() {
        for (let item of this.items) {
            if (item.parentitem_id == this.item.id) {
                return true;
            }
        }
    }

}
