/*!
 * 
 *                     aacService
 *
 *                     release: 2023.01.001
 *
 *                     date: 2023-05-08 11:03:49
 *
 *                     build: 2023.01.001.1683536629965
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["src_include_spicecharts_spicecharts_ts"],{4972:(e,t,r)=>{r.r(t),r.d(t,{SpiceChartsModule:()=>C});var a=r(6895),s=r(433),n=r(4357),o=r(5886),c=r(3283),i=r(8363),l=r(1652),p=r(1571),d=r(2067);const u=["chartcontainer"];let h=(()=>{class SpiceChart{constructor(e){this.libLoader=e}ngAfterViewInit(){this.loadNecessaryLibraries()}loadNecessaryLibraries(){this.libLoader.loadLib("chartjs").subscribe((()=>{this.renderchart()}))}renderchart(){const e={type:"bar",data:{labels:["January","February","March","April","May","June"],datasets:[{backgroundColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),borderColor:getComputedStyle(document.documentElement).getPropertyValue("--brand-primary"),data:[0,10,5,2,20,30,45]}]},options:{plugins:{legend:{display:!1}}}};this.chart=new Chart(this.chartContainer.nativeElement,e)}}return SpiceChart.ɵfac=function(e){return new(e||SpiceChart)(p.Y36(d.$))},SpiceChart.ɵcmp=p.Xpm({type:SpiceChart,selectors:[["spice-chart"]],viewQuery:function(e,t){if(1&e&&p.Gf(u,5),2&e){let e;p.iGM(e=p.CRH())&&(t.chartContainer=e.first)}},decls:3,vars:0,consts:[[1,"slds-size--1-of-1",2,"height","400px"],["chartcontainer",""]],template:function(e,t){1&e&&(p.TgZ(0,"div",0),p._UZ(1,"canvas",null,1),p.qZA())},encapsulation:2}),SpiceChart})(),C=(()=>{class SpiceChartsModule{}return SpiceChartsModule.ɵfac=function(e){return new(e||SpiceChartsModule)},SpiceChartsModule.ɵmod=p.oAB({type:SpiceChartsModule}),SpiceChartsModule.ɵinj=p.cJS({imports:[a.ez,s.u5,o.ObjectFields,c.GlobalComponents,i.ObjectComponents,l.SystemComponents,n.o]}),SpiceChartsModule})();("undefined"==typeof ngJitMode||ngJitMode)&&p.kYT(C,{declarations:[h],imports:[a.ez,s.u5,o.ObjectFields,c.GlobalComponents,i.ObjectComponents,l.SystemComponents,n.o]})}}]);