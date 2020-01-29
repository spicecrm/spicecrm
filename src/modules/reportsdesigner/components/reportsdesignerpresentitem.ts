/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reports-designer-present-item',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitem.html'
})
export class ReportsDesignerPresentItem implements AfterViewInit {

    /**
    * @input component: string
    */
    @Input() private component: string = '';
    @ViewChild('itemContainer', {static: true, read: ViewContainerRef}) private itemContainer: ViewContainerRef;
    private componentRef: any;

    constructor(private language: language, private metadata: metadata, private model: model) {
    }

    /**
    * @render view
    */
    public ngAfterViewInit() {
        this.render();
    }

    /**
    * @addComponent
    * @set componentRef
    */
    private render() {
        this.metadata.addComponent(this.component, this.itemContainer)
            .subscribe(componentRef => this.componentRef = componentRef);
    }

    /**
    * @destroy componentRef
    */
    public ngOnDestroy() {
        if (this.componentRef) this.componentRef.destroy();
    }
}
