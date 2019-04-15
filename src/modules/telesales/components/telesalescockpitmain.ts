/**
 * @module ModuleTeleSales
 */
import {Component, Input, OnChanges, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tele_sales_cockpit_main',
    templateUrl: './src/modules/telesales/templates/telesalescockpitmain.html',
})
export class TeleSalesCockpitMain implements OnDestroy, OnChanges {

    @ViewChild('maincontainer', {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    private renderedComponents: Array<any> = [];
    @Input() private module: any;

    constructor(private language: language,
                private metadata: metadata) {
    }

    get mainStyle() {
        let rect = this.maincontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    public ngOnChanges() {
        if (this.module) {
            this.renderView(this.module);
        }
    }

    resetView() {
        this.renderedComponents.forEach(component => component.destroy());
        this.renderedComponents = [];
    }

    renderView(module) {
        this.resetView();
        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitMain', module);

        let componentSet = componentconfig.componentset;
        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.maincontainer).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }

    public ngOnDestroy() {
        this.renderedComponents.forEach(component => component.destroy());
    }
}