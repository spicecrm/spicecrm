import {Component, OnInit} from '@angular/core';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'field-user-roles',
    templateUrl: '../templates/fielduserroles.html',
    standalone: false
})

export class fieldUserRoles extends fieldGeneric implements OnInit {


    public _sysRoles: any[] = [];

    /**
     * get the prospect list entries count
     */
    public ngOnInit() {
        super.ngOnInit();
        this.getSysRoles();
    }

    private getSysRoles(){
        this._sysRoles = this.metadata.getSysRoles();
    }

    public roleChecked(roleId){
        let roles = this.value ? JSON.parse(this.value) : [];
        return roles.find(r => r.sysuirole_id == roleId) ? 1 : 0;
    }

    /**
     * returns the roles filtered by Scope
     */
    get sysRoles(){
        let scope = this.model.getField('organizational_scope');

        if(!scope) return this._sysRoles;

        return this._sysRoles.filter(r => !r.rolescope || r.rolescope == 'a' || r.rolescope == scope);
    }

    public checkRole(roleId, checked){
        let roles = this.value ? JSON.parse(this.value) : [];
        if(checked){
            roles.push({
                id: this.model.utils.generateGuid(),
                sysuirole_id: roleId,
                defaultrole: roles.length == 0 ? 1 : 0
            })
        } else {
            let roleIndex = roles.findIndex(r => r.sysuirole_id == roleId);
            roles.splice(roleIndex, 1);
        }
        this.value = JSON.stringify(roles);
    }

    public isPrimaryRole(roleId){
        let roles = this.value ? JSON.parse(this.value) : [];
        let primary = roles.find(r => r.sysuirole_id == roleId);
        return primary && primary.defaultrole == 1 ? true : false;
    }

    get primaryId(){
        let roles = this.value ? JSON.parse(this.value) : [];
        let primary = roles.find(r => r.defaultrole == 1);
        return primary ? primary.sysuirole_id : undefined;
    }

    set primaryId(roleId){
        let roles = this.value ? JSON.parse(this.value) : [];
        let primary = roles.find(r => r.defaultrole == 1);
        if(primary) primary.defaultrole = 0;
        let selected = roles.find(r => r.sysuirole_id == roleId);
        if(selected){
            selected.defaultrole = 1;
        } else {
            roles.push({
                id: this.model.utils.generateGuid(),
                sysuirole_id: roleId,
                defaultrole: 1
            })
        }
        this.value = JSON.stringify(roles);
    }
}