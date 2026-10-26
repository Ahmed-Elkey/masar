import 'server-only';
import {publicBackend} from './server';
import {PROJECTS} from '@/lib/data';
import {mergeCatalogue,type CatalogueRecord} from '@/lib/liveCatalogue';
export async function liveCatalogue(){const db=publicBackend();if(!db)return {projects:PROJECTS,records:[] as CatalogueRecord[],connected:false};const {data,error}=await db.from('project_records').select('project_id,payload,source_url,source_checked_at,valid_until').gt('valid_until',new Date().toISOString()).lte('source_checked_at',new Date().toISOString());if(error)return {projects:PROJECTS,records:[] as CatalogueRecord[],connected:false};const records=(data??[]) as CatalogueRecord[];return {projects:mergeCatalogue(PROJECTS,records),records,connected:true};}
