import {
    Component,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Renderer2,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-integration-tools-button',
    templateUrl: './app/modules/reports/templates/reporterintegrationtoolsbutton.html'
})
export class ReporterIntegrationToolsButton implements OnChanges, OnDestroy {

    @ViewChild('actionitems', {read: ViewContainerRef}) actionitems: ViewContainerRef;

    @Input() integrationParams: any = {};

    clickListener: any;
    opened: boolean = false;
    actionComponents: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private footer: footer, private reporterconfig: reporterconfig, private renderer: Renderer2, private elementRef: ElementRef) {
    }

    ngOnChanges() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                switch (plugin) {
                    case 'kqueryanalizer':
                        this.metadata.addComponent('ReporterIntegrationQueryanalyzerButton', this.actionitems).subscribe(object => {
                            this.actionComponents.push(object);
                        })
                        break;
                }
            }
        }
    }

    ngOnDestroy() {
        if (this.clickListener)
            this.clickListener();
    }

    get isDisabled() {
        if (this.integrationParams.activePlugins) {
            for (let plugin in this.integrationParams.activePlugins) {
                switch (plugin) {
                    case 'kqueryanalizer':
                        return false;
                }
            }
        }

        return true;
    }

    toggleOpen() {
        this.opened = !this.opened;

        if (this.opened) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();
    }


    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.opened = false;
            this.clickListener();
        }
    }
}