/**
 * @module ModuleScrum
 */
import {
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges,
    OnDestroy
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'scrumtree-detail',
    templateUrl: './src/modules/scrum/templates/scrumtreedetail.html',
    providers: [model, view]
})
export class ScrumTreeDetail implements OnChanges, OnDestroy {

    @ViewChild('detailscontent', {read: ViewContainerRef, static: true}) private detailscontent: ViewContainerRef;

    @Input() private focusid: string = '';

    private viewComponent: any = null;
    private modelSubscription: any = null;

    constructor(private modellist: modellist, private view: view, private language: language, private elementRef: ElementRef, private metadata: metadata, private model: model, private broadcast: broadcast) {
        this.model.module = this.modellist.module;
        this.modelSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

        // this.view.displayLabels = false;
    }

    private handleMessage(message: any) {
        if (message.messagedata.module !== this.model.module)  return;

        switch (message.messagetype) {
            case 'model.delete':
                break;
            case 'model.save':
                if (this.model.id === message.messagedata.id) {
                    this.model.data = message.messagedata.data;
                }
                break;
        }
    }

    public ngOnChanges() {
        if (this.focusid) {
            if (!this.viewComponent) {
                this.metadata.addComponent('ObjectRecordDetails', this.detailscontent).subscribe(component => {
                    this.viewComponent = component;
                });
            }
        } else {
            if (this.viewComponent) {
                this.viewComponent.destroy();
                this.viewComponent = null;
            }
        }

        if (this.focusid && this.focusid != this.model.id) {
            this.model.id = this.focusid;
            this.model.getData();
        }
    }

    public ngOnDestroy() {
        this.modelSubscription.unsubscribe();
    }


    get canEdit() {
        try {
            return this.model.checkAccess('edit');
        } catch (e) {
            return false;
        }
    }


}
