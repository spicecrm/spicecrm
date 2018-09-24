import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {Subject} from 'rxjs';
import {modal} from "../../services/modal.service";
import {ModuleConfigAddDialog} from "./moduleconfigadddialog";


@Component({
    templateUrl: './src/workbench/templates/objectrepositorymanager.html'
})
export class ObjectRepositoryManager {

    crActive: boolean = false;
    objectRepos: Array<any> = [];
    objectReposSelectedItem: string = '';

    objrepoList: Array<any> = [];
    configList: any = {};

    currentModule: string = '';
    currentObjRepo: any = '';
    selectedId: string = '';
    selectedComponent: any = {};

    componentTree: Array<any> = [];
    currentTableActive: string = '';



    treelist: Array<any> = [];


    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language
    ) {


        // get module repos
        this.backend.getRequest('configurator/entries/sysuimodulerepository').subscribe(modules => {
            for (let module of modules) {

                var moduleObj = {};
                moduleObj = {
                    'id': module.id,
                    'name': module.module
                }
                this.objectRepos.push(moduleObj);
            }
        });

    }


    selectedOutputItemModule(event){
        console.log(event);
            this.backend.getRequest('configurator/entries/sysuiobjectrepository').subscribe(orepos => {

                console.log("orepos", orepos);
                this.objrepoList = [];

                for (let orepo of orepos) {
                    if(event.id == orepo.module){
                        this.objrepoList.push(orepo);
                    }
                }


                console.log(this.objrepoList);
        });
    }

    clickObjRepo(cor){
        this.currentObjRepo = cor;

        try {
            this.configList = JSON.parse(this.currentObjRepo.componentconfig);
        } catch (e) {
            console.error("JSON is invalid!", e);
        }
        console.log(this.configList);

        for (var k in this.configList){
            if (this.configList.hasOwnProperty(k)) {


                alert("Key is " + k + ", value is" + target[k]);
            }
        }


        console.log(this.currentObjRepo);


    }

    checkCurrentObjRepo(id){
        if(this.currentObjRepo.id == id){
            return true;
        }
        return false;
    }

}
