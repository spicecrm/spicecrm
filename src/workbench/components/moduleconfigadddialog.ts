import {
    Component,
    Input,
    Output,
    OnInit,
    EventEmitter,
} from '@angular/core';


import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';

import {toast} from "../../services/toast.service";



@Component({
    selector: 'moduleconfig-add-dialog',
    templateUrl: './src/workbench/templates/moduleconfigadddialog.html'
})
export class ModuleConfigAddDialog implements OnInit{


    @Input() mode: string = "";
    @Input() currentComponent: any;
    @Input() currentRole: string = "";
    @Input() currentType: string = "";
    @Input() currentModule: string = "";

    @Output('response') response$: EventEmitter<any> = new EventEmitter<any>()


    sysModules: Array<any> = [];
    components: Array<any> = [];
    addType: string = 'fieldset';
    addName: string = '';
    fieldsettype: string = 'custom';
    self;

    types = [
        { value: "custom", text: 'LBL_CUSTOM' },
        { value: "global", text: 'LBL_GLOBAL' },
    ];


    compSelectList: Array<any> = [];
    compSelectedItem: any;
    compDisabled = false;

    moduleSelectList: Array<any> = [];
    moduleSelectedItem: any;

    roleSelectList: Array<any> = [];
    roleSelectedItem: any;



    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private utils: modelutilities, private toast: toast,) {
    }


    ngOnInit(){

        // get all modules
        this.backend.getRequest('configurator/entries/sysmodules').subscribe(data => {
            this.moduleSelectList.push({"id": "*", "name": "*"});
            if(this.mode == "add" && "*" == this.currentModule){
                this.moduleSelectedItem = {"id": "*", "name": "*"};
            }
            for(let module of data){
                this.moduleSelectList.push({"id": module.id, "name": module.module});

                if(this.mode == "add" && module.module == this.currentModule){
                    this.moduleSelectedItem = {"id": module.id, "name": module.module};
                }
            }
            this.sortArray(this.moduleSelectList);
        });

        // get all roles
        this.backend.getRequest('configurator/entries/sysuiroles').subscribe(data => {

            this.roleSelectList.push({"id": "*", "name": "*"});
            for(let role of data){
                this.roleSelectList.push({"id": role.id, "name": role.name});

                if(this.mode == "copy" && role.id == this.currentRole){
                    this.roleSelectedItem = {"id": role.id, "name": role.name};
                }
                if(this.currentRole == "*"){
                    this.roleSelectedItem = {"id": "*", "name": "*"};
                }
            }
            this.sortArray(this.roleSelectList);
        });

        // get all objectrepositories
        this.backend.getRequest('configurator/entries/sysuiobjectrepository').subscribe(data => {

            for(let comp of data){
                this.compSelectList.push({"id": comp.id, "name": comp.object});

                if(this.mode == "copy"){
                    this.compDisabled = true;
                    this.compSelectedItem = {"id": this.currentComponent.id, "name": this.currentComponent.component};
                }
            }
            this.sortArray(this.compSelectList);
        });

    }


    validate(){
        // validation show button
        if(this.currentModule == "*"){
            if(this.compSelectedItem && this.roleSelectedItem && this.currentType){
                return false;
            }
        }else{
            if(this.compSelectedItem && this.moduleSelectedItem && this.roleSelectedItem && this.currentType){
                return false;
            }
        }
        return true;
    }

    // sort the list
    sortArray(list){
        list.sort(function(a, b){
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
        return list;
    }


    closeDialog() {
        this.self.destroy();
    }


    save() {

        var type = this.currentType;
        var table = "";
        var saveComp: any = {};

        let newid = this.modelutilities.generateGuid(); //generate id

        if(this.currentComponent){
            //copy
            let configString = JSON.stringify(this.currentComponent.componentconfig);
            saveComp = {
                component:  this.currentComponent.component,
                componentconfig: configString
            };

        }else{
            //add
            saveComp = {
                component: this.compSelectedItem.name,
                componentconfig: "{}"
            };
        }

        saveComp.id = newid;
        saveComp.role_id = this.roleSelectedItem.id;

        //set module if != default table
        if(saveComp.module != "*"){
            saveComp.module = this.moduleSelectedItem.name;
        }

        //find table
        if(type == "custom" && saveComp.module == "*"){table="sysuicustomcomponentdefaultconf"}
        if(type == "custom" && saveComp.module != "*"){table="sysuicustomcomponentmoduleconf"}
        if(type == "global" && saveComp.module == "*"){table="sysuicomponentdefaultconf"}
        if(type == "global" && saveComp.module != "*"){table="sysuicomponentmoduleconf"}


        this.saveComponent(saveComp, table);
    }


    saveComponent(saveComp, table){

        saveComp.type = this.currentType;

        let path = "";
        if(saveComp.module == "*"){
            path = "componentdefaultalreadyexists";
            delete saveComp.module;
        }else{
            path = "componentmodulealreadyexists";
        }

        //check if component exists
        this.backend.getRequest('spiceui/core/'+ path, saveComp).subscribe(
            data=> {
                delete saveComp.type;

                if(data == false){
                    this.backend.postRequest('configurator/'+ table +'/'+ saveComp.id, null, saveComp).subscribe(
                        (success) => {

                            this.toast.sendToast('saved');
                            saveComp.table = table;
                            this.response$.emit(saveComp);
                            this.self.destroy();
                        },
                        (error) => {
                            this.toast.sendAlert('saving failed!');
                            console.error(error);
                        }
                    );
                }else{
                    this.toast.sendAlert('Configuration already exists!');
                }
            },
            (error) => {
                this.toast.sendAlert('Saving configuration failed!');
                console.error(error);
            }
        )
    }

    selectedOutputItemComp(event){
        this.compSelectedItem = event;
    }

    selectedOutputItemModule(event){
        this.moduleSelectedItem = event;
    }

    selectedOutputItemRole(event){
        this.roleSelectedItem = event;
    }

}