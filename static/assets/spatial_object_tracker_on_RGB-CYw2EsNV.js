import{_ as v,r as B,q as b,w as e,a as t,j as o,b as g,f as l,n as _,o as k}from"./index-C5kSJgGr.js";const x=["src"],n="http://127.0.0.1:5000",G={__name:"spatial_object_tracker_on_RGB",setup(R){const r=B(`${n}/s_RGB/video_feed1`),d=()=>{r.value=`${n}/s_RGB/video_feed1`,_.post(`${n}/s_RGB/start_cameras`).then(a=>{console.log(a.data)}),_.post()},p=()=>{_.post(`${n}/s_RGB/stop_cameras`).then(a=>{console.log(a.data)})};return(a,s)=>{const i=o("el-card"),m=o("el-main"),c=o("el-button"),f=o("el-footer"),u=o("el-container");return k(),b(u,{class:"container"},{default:e(()=>[t(m,{class:"video-container"},{default:e(()=>[t(i,{class:"video-card"},{default:e(()=>[g("img",{src:r.value,class:"video-stream"},null,8,x)]),_:1})]),_:1}),t(f,{class:"footer"},{default:e(()=>[t(c,{type:"primary",onClick:d},{default:e(()=>s[0]||(s[0]=[l("开启摄像头")])),_:1}),t(c,{type:"danger",onClick:p},{default:e(()=>s[1]||(s[1]=[l("停止摄像头")])),_:1})]),_:1})]),_:1})}}},$=v(G,[["__scopeId","data-v-8833b96e"]]);export{$ as default};
