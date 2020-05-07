/**
 * @module SpiceInstaller
 */
import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";

/**
 * the object to pass when a step is selected
 */
interface stepObject {
    id: string;
    name: string;
    visible: boolean;
    completed: boolean;
}

@Injectable()
export class spiceinstaller {
    /**
     * an array of all the installer steps as objects
     */
    public steps: any = [];

    /**
     * the selected step object and its event emitter for tracking the change
     */
    private _selectedStep: stepObject;
    public selectedStep$: EventEmitter<stepObject> = new EventEmitter<stepObject>();

    /**
     * backend config
     */
    public systemid: string = '123';
    public systemname: string = 'spicy';
    public systemurl: string = 'http://localhost/spicecrm_be_installer';
    public systemproxy: number = 0;
    public systemdevmode: boolean = true;
    public systemloginprogressbar: number = 0;
    public systemallowforgotpass: number = 0;
    /**
     * systemcheck
     */
    public dbdrivers: any = [];
    /**
     * database
     */
    public db_host_name: string = '';
    public db_host_instance: string = '';
    public db_user_name: string = ''
    public db_password: string = '';
    public db_name: string = '';
    public db_type: string = 'mysql';
    public db_port: string = '';
    public db_manager: string = '';
    public persistent: boolean = true;
    public autofree: boolean = false;
    public debug: number = 0;
    public ssl: boolean = false;
    public collation: string = 'utf8_general_ci';

    /**
     * fts
     */
    public server: string = 'localhost';
    public port: string = '9200';
    public prefix: string = 'spicecrm_';
    /**
     * credentials
     */
    public username: string = '';
    public password: string = '';
    public firstname: string = '';
    public surname: string = '';
    public email: string = '';
    /**
     * language
     */
    public language: string = 'en_us';
    public configObject: any = {};
    constructor() {
        this.configObject = {
            backendconfig: {},
            database: {},
            dboptions: {},
            fts: {},
            credentials: {},
            language: {}
        }
        this._selectedStep = {
            id: 'setbackend',
            name: 'Set Backend',
            visible: true,
            completed: false,
        };
        this.steps = [
            {
                id: 'setbackend',
                name: 'Set Backend',
                visible: true,
                completed: false,
            },
            {
                id: 'systemcheck',
                name: 'System Requirements',
                visible: false,
                completed: false,
            },
            {
                id: 'licence',
                name: 'Licence',
                visible: false,
                completed: false,
            },
            {
                id: 'database',
                name: 'Database',
                visible: false,
                completed: false,
            },
            {
                id: 'fts',
                name: 'FTS',
                visible: false,
                completed: false
            },
            {
                id: 'credentials',
                name: 'Credentials',
                visible: false,
                completed: false
            },
            {
                id: 'setlanguage',
                name: 'Language',
                visible: false,
                completed: false
            },
            {
                id: 'review',
                name: 'Review and Install',
                visible: false,
                completed: false
            }
        ];
    }


    /**
     * getter for the selected step object
     */
    get selectedStep() {
        return this._selectedStep;
    }

    /**
     * emits the selected step
     * @param selectedStep
     */
    set selectedStep(selectedStep: stepObject) {
        this._selectedStep = selectedStep;
        this.selectedStep$.emit(this._selectedStep);
    }


    /**
     * takes the currentstep, finds its match in the array, finds the next step and sets it as the selected one
     * @param currentStep
     */
    public next(currentStep) {
        for (let i of this.steps) {
            if (i.id == currentStep.id) {
                let currentStepPos = this.steps.indexOf(i);
                let nextStepPos = currentStepPos + 1;
                let nextStep = this.steps[nextStepPos];
                nextStep.visible = true;
                this.selectedStep = nextStep;
            }
        }
    }

}
