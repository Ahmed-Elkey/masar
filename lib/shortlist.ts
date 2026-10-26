"use client";
import {useSyncExternalStore} from 'react';
import {PROJECTS} from './data';
import {sanitizeSelection,type Shortlist} from './selection';
export type {Shortlist} from './selection';
export const SHORTLIST_KEY='nile-estates-shortlist-v1';
const empty:Shortlist={saved:[],compare:[]};
let current=empty,serialized='',loaded=false,issue='',memoryOnly=false;
const listeners=new Set<()=>void>();
export function parseSelection(value:unknown):Shortlist{return sanitizeSelection(value,PROJECTS.map(p=>p.id));}
function read(){if(memoryOnly)return current;try{const raw=localStorage.getItem(SHORTLIST_KEY)??'';if(!loaded||serialized!==raw){serialized=raw;current=raw?parseSelection(JSON.parse(raw)):empty;loaded=true;}}catch{issue='storage';loaded=true;}return current;}
function subscribe(listener:()=>void){listeners.add(listener);const sync=()=>{read();listener();};addEventListener('storage',sync);read();listener();return()=>{listeners.delete(listener);removeEventListener('storage',sync);};}
export function updateShortlist(value:Shortlist){current=parseSelection(value);loaded=true;try{serialized=JSON.stringify(current);localStorage.setItem(SHORTLIST_KEY,serialized);issue='';memoryOnly=false;}catch{issue='storage';memoryOnly=true;}listeners.forEach(fn=>fn());}
export function useShortlist(){const value=useSyncExternalStore(subscribe,read,()=>empty);return {...value,storageError:issue==='storage',toggle:(id:string,kind:'saved'|'compare')=>{const ids=value[kind];if(kind==='compare'&&!ids.includes(id)&&ids.length>=3)return false;updateShortlist({...value,[kind]:ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]});return true;}};}
export function selectionUrl(value:Shortlist,lang:string){const params=new URLSearchParams({lang});if(value.saved.length)params.set('saved',value.saved.join(','));if(value.compare.length)params.set('compare',value.compare.join(','));return `${location.origin}/planner?${params}`;}
export function downloadJson(name:string,value:unknown){const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
