/**
 * @module ObjectComponents
 */
import {ComponentFactoryResolver, Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-tabbed-details',
    templateUrl: '../templates/objectrecordtabbeddetails.html',
    // providers: [view],
    styles: [
        '.slds-badge { font-weight: bold; background-color: #c00; color: #fff; padding: .125rem .4rem; }'
    ]
})
export class ObjectRecordTabbedDetails implements OnInit {

    public componentconfig: any = {};
    public activeTab: number = 0;
    public activatedTabs: any = [0];
    public componentTabs: any = [];

    constructor(public view: view, public metadata: metadata, public componentFactoryResolver: ComponentFactoryResolver, public model: model, public language: language) {
        this.view.isEditable = true;
    }

    get tabs() {
        return this.componentTabs ? this.componentTabs : [];
    }

    public ngOnInit() {
        if (this.getTabs().length == 0) {
            if (this.componentconfig && this.componentconfig.componentset) {
                let items = this.metadata.getComponentSetObjects(this.componentconfig.componentset);
                this.componentTabs = [];
                for (let item of items) {
                    this.componentTabs.push(item.componentconfig);
                }
            } else {
                if (!this.componentconfig.tabs) {
                    let componentconfig = this.metadata.getComponentConfig('ObjectRecordTabbedDetails', this.model.module);
                    this.componentTabs = componentconfig.tabs;
                } else {
                    this.componentTabs = this.componentconfig.tabs;
                }
            }
        } else {
            this.componentTabs = this.getTabs();
        }
    }

    public getTabs() {
        try {
            return this.componentconfig.tabs ? this.componentconfig.tabs : [];
        } catch (e) {
            return [];
        }
    }

    public setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    public checkRenderTab(tabindex) {
        return tabindex == this.activeTab || this.activatedTabs.indexOf(tabindex) > -1;
    }

    public showTab(tabindex) {

        if (tabindex === this.activeTab) {
            return true;
        } else {
            return false;
        }
    }

    public getDisplay(tabindex) {

        if (tabindex !== this.activeTab) {
            return {
                display: 'none'
            };
        }
    }

    public cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    public save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }

    public showErrorsOnTab( tabindex, nrErrors ) {
        this.componentTabs[tabindex].hasErrors = nrErrors;
    }

}
