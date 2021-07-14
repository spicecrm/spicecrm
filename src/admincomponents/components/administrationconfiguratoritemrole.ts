/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/admincomponents/templates/administrationconfiguratoritemrole.html'
})
export class AdministrationConfiguratorItemRole implements OnInit{

    @Input() editmode: boolean = false;
    @Input() fieldvalue: any = {};
    @Output() fieldvalueChange: EventEmitter<string> = new EventEmitter<string>();
    roles: Array<any> = [];

    constructor(private metadata: metadata){
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