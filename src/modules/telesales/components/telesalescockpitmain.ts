import {Component, Input, HostBinding, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_main',
    templateUrl: './app/modules/telesales/templates/telesalescockpitmain.html',
})
export class TeleSalesCockpitMain {

    @ViewChild('maincontainer', {read: ViewContainerRef}) maincontainer: ViewContainerRef;
    module: string;
    renderedComponents: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private telecockpitservice: telecockpitservice) {

        this.telecockpitservice.selectedItem$.subscribe(data => this.renderView(data));

    }

    get mainStyle() {
        let rect = this.maincontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height' : 'calc(100vh - ' + rect.top + 'px)'
        }
    }

    resetView(){
        for(let renderedComponent of this.renderedComponents){
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    renderView(modeldata){

        this.resetView();
        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitMain', modeldata.module);

        let componentSet = componentconfig.componentset;
        if(componentSet){
            let components = this.metadata.getComponentSetObjects(componentSet);
            for(let component of components){
                this.metadata.addComponent(component.component, this.maincontainer).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }

}