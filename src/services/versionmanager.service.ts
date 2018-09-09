import {
    Injectable,
} from '@angular/core';


/**
 * a service which holds versions of all app modules
 * author: Sebastian Franz
 */
@Injectable()
export class VersionManagerService
{
    private _module_versions = [];

    constructor(
    ) {

    }

    get module_versions()
    {
        //return globals.module_versions;
        return this._module_versions;
    }

    set module_version(val:{name:string,version:string,build_date:string})
    {
        //console.log(val);
        let mod:any = this.getModule(val.name);
        if( !mod || mod.length == 0 )
            this._module_versions.push(val);
        else
            mod = val;
    }

    registerModule(module)
    {
        this.module_version = {
            name: module.constructor.name,
            version: module.version,
            build_date: module.build_date
        };
    }

    getModule(name:string)
    {
        let mod = this._module_versions.filter((e) => {return e.name == name})[0];
        //console.log(name, mod);
        return mod;
    }

}