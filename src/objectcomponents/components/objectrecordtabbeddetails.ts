import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, OnInit, Input} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-tabbed-details',
    templateUrl: './src/objectcomponents/templates/objectrecordtabbeddetails.html',
    // providers: [view]
    styles: [
        '.slds-badge { font-weight: bold; background-color: #c00; color: #fff; padding: .125rem .4rem; }'
    ]
})
export class ObjectRecordTabbedDetails implements OnInit{

    componentconfig: any = {};
    activeTab: number = 0
    activatedTabs: Array<number> = [0];
    componentTabs: Array<any> = [];

    constructor(private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language) {
        this.view.isEditable = true;
    }

    get tabs(){
        return this.componentTabs ? this.componentTabs : [];
    }

    ngOnInit(){
        if (!this.componentconfig.tabs) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordTabbedDetails', this.model.module);
            this.componentTabs = componentconfig.tabs;
        } else {
            this.componentTabs = this.componentconfig.tabs;
        }
    }

    setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    checkRenderTab(tabindex){
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1;
    }

    showTab(tabindex) {

        if (tabindex === this.activeTab)
            return  true;
        else
            return false;

    }

    getDisplay(tabindex) {

        if (tabindex !== this.activeTab)
            return {
                display: 'none'
            };

    }

    cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }

    showErrorsOnTab( tabindex, nrErrors ) {
        this.componentTabs[tabindex].hasErrors = nrErrors;
    }

}