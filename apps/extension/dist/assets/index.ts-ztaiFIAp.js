import{b as o}from"./source-DMU6Yiac.js";chrome.runtime.onMessage.addListener((e,r,t)=>{if(e.type==="EXTRACT_CONTEXT"){const n=o(window.location.href,document.title);t(n)}return!0});
