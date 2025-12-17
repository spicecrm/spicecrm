/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2025.02.001
 *
 *                     date: 2025-12-17 12:38:45
 *
 *                     build: 2025.02.001.1765971525411
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicecharts_spicecharts_ts"],{98327:(t,e,r)=>{r.r(e),r.d(e,{SpiceChartsModule:()=>m});var s=r(14572),a=r(10936),n=r(40432),i=r(47562),c=r(86485),o=r(47468),l=r(87371),d=r(44557),h=r(24703);const p=["chartcontainer"];let u=(()=>{class SpiceChart{constructor(t){this.libLoader=t}ngAfterViewInit(){this.loadNecessaryLibraries()}loadNecessaryLibraries(){this.libLoader.loadLib("chartjs").subscribe(()=>{this.renderchart()})}renderchart(){const t={type:"bar",data:{labels:["January","February","March","April","May","June"],datasets:[{backgroundColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),borderColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),data:[0,10,5,2,20,30,45]}]},options:{plugins:{legend:{display:!1}}}};this.chart=new Chart(this.chartContainer.nativeElement,t)}static{this.ɵfac=function(t){return new(t||SpiceChart)(d.rXU(h.b))}}static{this.ɵcmp=d.VBU({type:SpiceChart,selectors:[["spice-chart"]],viewQuery:function(t,e){if(1&t&&d.GBs(p,5),2&t){let t;d.mGM(t=d.lsd())&&(e.chartContainer=t.first)}},standalone:!1,decls:3,vars:0,consts:[["chartcontainer",""],[1,"slds-size--1-of-1",2,"height","400px"]],template:function(t,e){1&t&&(d.j41(0,"div",1),d.nrm(1,"canvas",null,0),d.k0s())},encapsulation:2})}}return SpiceChart})(),m=(()=>{class SpiceChartsModule{static{this.ɵfac=function(t){return new(t||SpiceChartsModule)}}static{this.ɵmod=d.$C({type:SpiceChartsModule})}static{this.ɵinj=d.G2t({imports:[s.MD,a.YN,i.ObjectFields,c.GlobalComponents,o.ObjectComponents,l.SystemComponents,n.h]})}}return SpiceChartsModule})();("undefined"==typeof ngJitMode||ngJitMode)&&d.Obh(m,{declarations:[u],imports:[s.MD,a.YN,i.ObjectFields,c.GlobalComponents,o.ObjectComponents,l.SystemComponents,n.h]})}}]);