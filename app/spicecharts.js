/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2024.01.001
 *
 *                     date: 2024-05-28 17:40:40
 *
 *                     build: 2024.01.001.1716910840504
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicecharts_spicecharts_ts"],{32475:(t,e,r)=>{r.r(e),r.d(e,{SpiceChartsModule:()=>m});var s=r(60177),a=r(84341),n=r(71341),i=r(7745),c=r(12948),o=r(37328),l=r(70569),d=r(54438),h=r(82802);const p=["chartcontainer"];let u=(()=>{class SpiceChart{constructor(t){this.libLoader=t}ngAfterViewInit(){this.loadNecessaryLibraries()}loadNecessaryLibraries(){this.libLoader.loadLib("chartjs").subscribe((()=>{this.renderchart()}))}renderchart(){const t={type:"bar",data:{labels:["January","February","March","April","May","June"],datasets:[{backgroundColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),borderColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),data:[0,10,5,2,20,30,45]}]},options:{plugins:{legend:{display:!1}}}};this.chart=new Chart(this.chartContainer.nativeElement,t)}static#t=this.ɵfac=function(t){return new(t||SpiceChart)(d.rXU(h.b))};static#e=this.ɵcmp=d.VBU({type:SpiceChart,selectors:[["spice-chart"]],viewQuery:function(t,e){if(1&t&&d.GBs(p,5),2&t){let t;d.mGM(t=d.lsd())&&(e.chartContainer=t.first)}},decls:3,vars:0,consts:[[1,"slds-size--1-of-1",2,"height","400px"],["chartcontainer",""]],template:function(t,e){1&t&&(d.j41(0,"div",0),d.nrm(1,"canvas",null,1),d.k0s())},encapsulation:2})}return SpiceChart})(),m=(()=>{class SpiceChartsModule{static#t=this.ɵfac=function(t){return new(t||SpiceChartsModule)};static#e=this.ɵmod=d.$C({type:SpiceChartsModule});static#r=this.ɵinj=d.G2t({imports:[s.MD,a.YN,i.ObjectFields,c.GlobalComponents,o.ObjectComponents,l.SystemComponents,n.h]})}return SpiceChartsModule})();("undefined"==typeof ngJitMode||ngJitMode)&&d.Obh(m,{declarations:[u],imports:[s.MD,a.YN,i.ObjectFields,c.GlobalComponents,o.ObjectComponents,l.SystemComponents,n.h]})}}]);