/**
 * @module ModuleACL
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types-add-action',
    templateUrl: '../templates/acltypesmanagertypesaddaction.html',
})
export class ACLTypesManagerTypesAddAction implements OnInit{

    /**
     * reference to the modal itself
     */
    private self: any = {};

    currentactions: any[] = [];
    _currentActions: string[] = [];

    /**
     * the action bound int he modal
     */
    public action: string = '';

    /**
     * the description bound to the modal
     */
    public description: string = '';

    /**
     * an event emitter triggering when the action is added
     */
    private addaction: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public metadata: metadata, public language: language, public modelutilities: modelutilities) {

    }

    ngOnInit(){
        for(let currentaction of this.currentactions){
            this._currentActions.push(currentaction.action);
        }
    }

    close(){
        this.self.destroy();
    }

    get adddisabled(){
        return this.action == '' || this._currentActions.indexOf(this.action) >= 0;
    }

    add(){
        this.addaction.emit({action: this.action, description: this.description});
        this.close();
    }

}
