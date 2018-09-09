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
    templateUrl: './app/modules/acl/templates/acltypesmanagertypesaddaction.html',
})
export class ACLTypesManagerTypesAddAction implements OnInit{

    self: any = {};
    currentactions: Array<any> = [];
    _currentActions: Array<string> = [];
    action: string = '';
    addaction: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {

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
        this.addaction.emit(this.action);
        this.close();
    }

}