"use client";
import {createContext,useContext,useEffect,useState,useMemo,type ReactNode} from 'react';
import {PROJECTS} from '@/lib/data';
import {mergeCatalogue,type CatalogueRecord} from '@/lib/liveCatalogue';
const Context=createContext({projects:PROJECTS,records:[] as CatalogueRecord[]});
export function useProjects(){return useContext(Context).projects;}
export function useCatalogueRecords(){return useContext(Context).records;}
export default function CatalogueProvider({children}:{children:ReactNode}){const [records,setRecords]=useState<CatalogueRecord[]>([]);useEffect(()=>{const controller=new AbortController();const update=()=>{setRecords(old=>old.filter(r=>Date.parse(r.valid_until)>Date.now()));fetch('/api/catalogue',{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(data=>{if(Array.isArray(data.records))setRecords(data.records);}).catch(()=>{});};update();const timer=setInterval(update,300000);addEventListener('focus',update);return()=>{controller.abort();clearInterval(timer);removeEventListener('focus',update);};},[]);const value=useMemo(()=>({projects:mergeCatalogue(PROJECTS,records),records}),[records]);return <Context.Provider value={value}>{children}</Context.Provider>;}
