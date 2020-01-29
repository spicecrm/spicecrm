/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reports-designer-integrate',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrate.html'
})
export class ReportsDesignerIntegrate {

    protected items: any[] = [];
    private selectedItemId: string = '';

    constructor(private language: language, private metadata: metadata) {
    }

    /**
    * @loadItems
    */
    public ngOnInit() {
        this.loadItems();
    }

    /**
    * @set items from metadata.getComponentSetObjects
    */
    private loadItems() {
        const conf = this.metadata.getComponentConfig('ReportsDesignerPresent', 'KReports');
        if (conf.componentset && conf.componentset.length > 0) {
            const items = this.metadata.getComponentSetObjects(conf.componentset);
            this.items = items
                .filter(item => !!item.componentconfig)
                .map(item => ({...item.componentconfig, id: item.id, sequence: item.sequence}))
                .sort((a, b) => !isNaN(parseInt(a.sequence, 10)) && !isNaN(parseInt(b.sequence, 10)) ? +a.sequence > +b.sequence ? 1 : -1 : 0);
        }
    }

    /**
    * @param itemId: string
    * @set selectedItemId
    */
    private setSelectedItemId(itemId) {
        this.selectedItemId = itemId;
    }
}
