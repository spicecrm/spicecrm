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
import {ObjectRepositoryManagerAddRepo} from "./objectrepositorymanageraddrepo";


@Component({
    templateUrl: './src/workbench/templates/objectrepositorymanager.html'
})
export class ObjectRepositoryManager {

    crActive: boolean = false;
    objectRepos: Array<any> = [];
    objectReposSelectedItem: string = '';

    objrepoList: Array<any> = [];
    configList: any = {};
    currentConfigArray: Array<any> = [];

    fieldTypeList: Array<any> = ["string", "boolean", "fieldset"];

    newRepo: any = {
        component: "",
        componentconfig: "",
        description: "",
        id: "",
        module: "",
        object: "",
        package: ""
    };

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
        private language: language,
        private modalservice: modal,
    ) {


        // get module repos
        this.backend.getRequest('configurator/entries/sysuimodulerepository').subscribe(modules => {
            for (let module of modules) {

                var moduleObj = {};
                moduleObj = {
                    'id': module.id,
                    'name': module.module,
                    'group': "global"
                }
                this.objectRepos.push(moduleObj);
            }
            this.objectRepos = Object.assign([], this.objectRepos);
        });

        this.backend.getRequest('configurator/entries/sysuicustommodulerepository').subscribe(modules => {
            for (let module of modules) {

                var moduleObj = {};
                moduleObj = {
                    'id': module.id,
                    'name': module.module,
                    'group': "custom"
                }
                this.objectRepos.push(moduleObj);
            }
            this.objectRepos = Object.assign([], this.objectRepos);
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
        this.currentConfigArray = [];
        try {
            this.configList = JSON.parse(this.currentObjRepo.componentconfig);

            let counterId = 0;

            for (var name in this.configList) {
                if (this.configList.hasOwnProperty(name)) {

                    let fieldConfig = {id: counterId, name: name, type: this.configList[name].type};
                    this.currentConfigArray.push(fieldConfig);
                    counterId++;
                }
            }

        } catch (e) {
            console.warn("JSON is invalid or empty!");
        }


    }

    checkCurrentObjRepo(id){
        if(this.currentObjRepo.id == id){
            return true;
        }
        return false;
    }

    addConfig(){
        this.currentConfigArray.push({id:  this.currentConfigArray.length + 1, name: "", type: ""});
    }

    saveChanges() {
        let configObject = {};
        let currentConfigArrayCopy = [...this.currentConfigArray];

        for(let currentConfigItem of currentConfigArrayCopy){
            let typeObject = {};
            typeObject["type"] = currentConfigItem.type;
            configObject[currentConfigItem.name] = typeObject;
        }
        let saveConfig = JSON.stringify( configObject);
        this.currentObjRepo.componentconfig = saveConfig;


        console.log("desc", this.currentObjRepo);

    }

    addObjRepo(){
        this.modalservice.openModal('ObjectRepositoryManagerAddRepo').subscribe(modal => {
             modal.instance.objRepo = this.newRepo;

            modal.instance.closedialog.subscribe(added => {
                if (added){
                    console.log("this.newRepo", this.newRepo);
                }
            });
        });
    }



}
