/**
 * @module SpiceInstaller
 */
import { Component, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { SpiceInstallerSetBackEnd } from '../components/spiceinstallersetbackend';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * the object to pass when a step is selected
 */
export interface stepObject {
    id: string;
    name: string;
    completed: boolean;
    pos: number;
    prev?: stepObject;
    next?: stepObject;
}

@Injectable()
export class spiceinstaller
{
    /**
     * an array of all the installer steps as objects
     */
    public steps: any = [];

    /**
     * backend config
     */
    public systemid: string = '000';
    public systemname: string = 'SpiceCRM';
    public systemurl: string = window.location.href.split('#')[0] + 'api';
    public systemproxy: number = 0;
    public systemdevmode: boolean = false;
    public systemloginprogressbar: number = 0;
    public systemloginsidebar: number = 0;
    public systemallowforgotpass: number = 0;
    public frontendUrl: string = window.location.href.split('#')[0];

    /**
     * repeated password variable holder
     */
    public rpPassword = '';

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
    public db_type: string = '';
    public db_port: string = '';
    public db_manager: string = '';
    public persistent: boolean = true;
    public autofree: boolean = false;
    public debug: number = 0;
    public ssl: boolean = false;
    public collation: string = '';

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
    public prefix: string = '';
    public transferProtocol: string = 'http';
    public elasticUser: string = '';
    public elasticpassword: string = '';
    public elastichttps: boolean = false;
    public elasticSSLVerify: boolean = false;



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

    /**
     * the selected step object
     */
    public selectedStep: stepObject;

    public jumpSubject = new Subject<any>();

    public nameFormats = {
        's f l': 'Mr. David Livingstone',
        'f l': 'David Livingstone',
        's l': 'Mr. Livingstone',
        'l, s f': 'Livingstone, Mr. David',
        'l, f': 'Livingstone, David',
        's l, f': 'Mr. Livingstone, David',
        'l s f': 'Livingstone Mr. David',
        'l f s': 'Livingstone David Mr.'
    };

    constructor() {
        this.configObject = {
            backendconfig: {},
            database: {},
            dboptions: {},
            fts: {},
            credentials: {},
            preferences: {},
            language: ''
        };
        this.steps = [
            {
                id: 'setbackend',
                name: 'Set Backend',
                completed: false,
            },
            {
                id: 'systemcheck',
                name: 'System Requirements',
                completed: false,
            },
            {
                id: 'licence',
                name: 'Licence',
                completed: false,
            },
            {
                id: 'database',
                name: 'Database',
                completed: false,
            },
            {
                id: 'fts',
                name: 'FTS',
                completed: false
            },
            {
                id: 'credentials',
                name: 'Credentials',
                completed: false
            },
            {
                id: 'preferences',
                name: 'Output & Export',
                completed: false
            },
            {
                id: 'review',
                name: 'Review & Install',
                completed: false
            }
        ];
        this.selectedStep = this.steps[0];
        let prev;
        this.steps.forEach( ( step, i ) => {
            step.pos = i;
            step.prev = prev ? prev : undefined;
            if ( step.prev ) step.prev.next = step;
            prev = step;
        });
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

    public jump( destination: stepObject ) {
        if ( !destination ) return;
        this.selectedStep = destination;
    }

}
