import{_ as v,r as g,q as x,w as e,a as t,j as o,b as y,f as l,n as r,o as b}from"./index-C5kSJgGr.js";const k=["src"],n="http://127.0.0.1:5000",C={__name:"disparity_estimator",setup($){const c=g(`${n}/d_estimator/video_feed`),d=()=>{c.value=`${n}/d_estimator/video_feed`,r.post(`${n}/d_estimator/start_cameras`).then(a=>{console.log(a.data)}),r.post()},i=()=>{r.post(`${n}/d_estimator/stop_cameras`).then(a=>{console.log(a.data)})};return(a,s)=>{const m=o("el-card"),p=o("el-main"),_=o("el-button"),f=o("el-footer"),u=o("el-container");return b(),x(u,{class:"container"},{default:e(()=>[t(p,{class:"video-container"},{default:e(()=>[t(m,{class:"video-card"},{default:e(()=>[y("img",{src:c.value,class:"video-stream"},null,8,k)]),_:1})]),_:1}),t(f,{class:"footer"},{default:e(()=>[t(_,{type:"primary",onClick:d},{default:e(()=>s[0]||(s[0]=[l("开启摄像头")])),_:1}),t(_,{type:"danger",onClick:i},{default:e(()=>s[1]||(s[1]=[l("停止摄像头")])),_:1})]),_:1})]),_:1})}}},N=v(C,[["__scopeId","data-v-9dc63ebe"]]);export{N as default};
