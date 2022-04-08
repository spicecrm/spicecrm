/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,Output,
    NgModule,
    ViewChild,
    OnInit,
    ViewContainerRef,
    EventEmitter
} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'administration-configurator-item-role',
    templateUrl: '../templates/administrationconfiguratoritemrole.html'
})
export class AdministrationConfiguratorItemRole implements OnInit{

    @Input() editmode: boolean = false;
    @Input() fieldvalue: any = {};
    @Output() fieldvalueChange: EventEmitter<string> = new EventEmitter<string>();
    roles: Array<any> = [];

    constructor(public metadata: metadata){
        // this.roles.push({id: '*', name: '*'});
    }

    loadRoles(){
        let roles = this.metadata.getRoles();
        roles.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
        for(let role of roles){
            this.roles.push(role);
        }
    }

    ngOnInit(){
        if(this.editmode || this.fieldvalue != '*'){
            this.loadRoles();
        }
    }

    get roleValue(){
        return this.fieldvalue;
    }

    set roleValue(value){
        this.fieldvalue = value;
        this.fieldvalueChange.emit(value);
    }

    get rolename(){

            for(let role of this.roles){
                if(role.id == this.fieldvalue){
                    return role.name;
                }
            }

            return this.fieldvalue;
        /*
        for(let role of this.roles){
            if(role.id == this.fieldvalue){
                return role.name;
            }
        }
        */
    }

}
