/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SpiceInstaller
 */
import {EventEmitter, Injectable} from '@angular/core';

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
    public selectedStep$: EventEmitter<stepObject> = new EventEmitter<stepObject>();
    /**
     * backend config
     */
    public systemid: string = '000';
    public systemname: string = '';
    public systemurl: string = '';
    public systemproxy: number = 1;
    public systemdevmode: boolean = false;
    public systemloginprogressbar: number = 0;
    public systemallowforgotpass: number = 0;
    public frontendUrl: string = window.location.href.split('#')[0];
    /**
     * systemcheck
     */
    public dbdrivers: any = [];
    /**
     * database defaults
     */

    public db_host_name: string = '';
    public db_host_instance: string = '';
    public db_user_name: string = '';
    public db_password: string = '';
    public db_name: string = '';
    public db_type: string = 'mysqli';
    public db_port: string = '';
    public db_manager: string = '';
    public persistent: boolean = true;
    public autofree: boolean = false;
    public debug: number = 0;
    public ssl: boolean = false;
    public collation: string = 'utf8_general_ci';
    public dbaccessuser: string = 'admin';
    /**
     * existing or new user for database access
     */
    public new_db_user_name: string = '';
    public new_db_password: string = '';
    public ext_db_user_name: string = '';
    public ext_db_password: string = '';
    /**
     * postgresql additional parameters
     */
    public lc_collate: string = 'en_US.UTF-8';
    public lc_ctype: string = 'en_US.UTF-8';
    /**
     * oracle additional parameters
     */

    public db_schema: string = 'SpiceCRM';
    /**
     * fts
     */

    public server: string = '';
    public port: string = '9200';
    public prefix: string = 'spicecrm_';
    public transferProtocol: string = 'http';
    /**
     * credentials
     */
    public username: string = 'admin';
    public password: string = '';
    public firstname: string = '';
    public surname: string = 'Administrator';
    public email: string = '';
    /**
     * language
     */
    public language: any = {language_code: 'en_us', language_name: 'English (US)'};
    public configObject: any = {};

    constructor() {
        this.configObject = {
            backendconfig: {},
            database: {},
            databaseuser: {},
            dboptions: {},
            fts: {},
            credentials: {},
        },
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
     * the selected step object and its event emitter for tracking the change
     */
    private _selectedStep: stepObject;

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

    /**
     * makes a human readable label out of an object/array key
     * @param key
     */
    public keyToLabel(key: string) {
        let label = key.charAt(0).toUpperCase() + key.slice(1);

        if (key.includes('dir')) {
            label = label.replace('dir', 'directory');
        }
        if (key.includes('_')) {
            label = label.split('_').join(' ');
        }
        if (key.match(/(?=[A-Z])/)) {
            label = label.split(/(?=[A-Z])/).join(' ');
        }
        if (key.includes('db')) {
            label = label.replace('Db', 'Database');
        }
        return label;
    }
}
