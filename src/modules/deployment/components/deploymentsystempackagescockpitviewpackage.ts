/**
 * @module SystemComponents
 */
import {Component, Host, Input, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {loader} from "../../../services/loader.service";
import {modal} from "../../../services/modal.service";
import {broadcast} from "../../../services/broadcast.service";
import {DeploymentSystemPackagesCockpitView} from "./deploymentsystempackagescockpitview";
import {DeploymentPackageI} from "../interfaces/deployment.interfaces";

/**
 * release package view
 */
@Component({
    selector: 'deployment-system-packages-cockpit-view-package',
    templateUrl: '../templates/deploymentsystempackagescockpitviewpackage.html',
})
export class DeploymentSystemPackagesCockpitViewPackage implements OnInit {
    /**
     * package input
     */
    @Input() public package: DeploymentPackageI;
    /**
     * package extensions
     */
    public extensions: any[] = [];
    /**
     * required packages
     */
    public requiredPackages: any[] = [];
    /**
     * holds is loading boolean
     */
    public loading: string = undefined;

    constructor(
        public language: language,
        public backend: backend,
        public configurationService: configurationService,
        public loader: loader,
        public modal: modal,
        @Host() public parentView: DeploymentSystemPackagesCockpitView,
        public broadcast: broadcast
    ) {

    }

    /**
     * disabled if installed or the required extensions are not loaded
     */
    get disabled() {

        if (this.package.rpstatus == this.parentView.statusConst.STATUS_DEPLOYED) return false;

        let disabled = false;
        this.extensions.some(extension => {
            if (!extension.status) return disabled = true;
        });
        this.requiredPackages.some(pkg => {
            if (pkg.rpstatus != this.parentView.statusConst.STATUS_DEPLOYED) return disabled = true;
        });

        return disabled;
    }

    /**
     * set split the package extensions and set the required packages
     */
    public ngOnInit() {

        if (this.package.extensions) {
            this.package.extensions.split(',').forEach(extension => {
                this.extensions.push({
                    name: extension,
                    status: this.configurationService.checkCapability(extension)
                });
            });
        }

        if (this.package.packages) {
            this.requiredPackages = this.parentView.packages.filter(p => this.package.packages.split(',').indexOf(p.package) >= 0);
        }
    }

    /**
     * download package
     * @param pkg
     */
    public download(pkg) {
        this.loading = 'package';
        this.backend.postRequest(`module/SystemDeploymentPackages/${pkg.id}/system/${pkg.source_system}/download`).subscribe(
            response => {
                this.loading = 'configuration';
                this.loader.load().subscribe(() => {
                    this.package.rpstatus = this.parentView.statusConst.STATUS_FETCHED;
                    this.broadcast.broadcastMessage('loader.reloaded');
                    this.loading = undefined;
                });
            });
    }

    /**
     * install package
     * @param id
     */
    public install(id: string) {
        this.loading = 'package';
        this.backend.postRequest(`module/SystemDeploymentPackages/${id}/setup`).subscribe(
            response => {
                this.loading = 'configuration';
                this.loader.load().subscribe(() => {
                    this.package.rpstatus = this.parentView.statusConst.STATUS_DEPLOYED;
                    this.broadcast.broadcastMessage('loader.reloaded');
                    this.loading = undefined;
                });
            });
    }

    /**
     * uninstall package
     * @param id
     */
    public uninstall(id: string) {
        this.loading = 'package';
        this.backend.deleteRequest(`module/SystemDeploymentPackages/${id}/setup`).subscribe(() => {
            this.loading = 'configuration';
            this.package.rpstatus = this.parentView.statusConst.STATUS_FETCHED
            this.loader.load().subscribe(() => {
                this.broadcast.broadcastMessage('loader.reloaded');
                this.loading = undefined;
            });
        });
    }
}
