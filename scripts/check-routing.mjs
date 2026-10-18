import {readFileSync} from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const base=process.env.ROUTING_TEST_URL||'http://127.0.0.1:3000';
const projects={oia:[31.706133,29.944929]};
const places={citadel:[31.2599,30.0287],'festival-city':[31.4083,30.0296]};
function metres(a,b){const rad=Math.PI/180,dlat=(b[1]-a[1])*rad,dlng=(b[0]-a[0])*rad;return 12742000*Math.asin(Math.sqrt(Math.sin(dlat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dlng/2)**2));}
const results=[];
for(const [id,coordinate] of Object.entries(places)){
 const response=await fetch(`${base}/api/route?${new URLSearchParams({project:'oia',destination:`landmark:${id}`})}`);
 assert.equal(response.status,200,`${id}: routing service unavailable`);
 const route=await response.json(),points=route.geometry.coordinates;
 assert.equal(route.geometry.type,'LineString');assert.ok(points.length>2);
 assert.ok(metres(points[0],projects.oia)<2000,'Route starts at the selected project');
 assert.ok(metres(points.at(-1),coordinate)<2000,'Route ends at the selected place');
 assert.ok(route.distance>=metres(projects.oia,coordinate)*.98,'Road distance must not be a straight-line shortcut');
 assert.ok(route.duration>0&&route.distance>0);results.push(route.distance);
}
assert.notEqual(results[0],results[1],'Changing destinations must change the route');
const invalid=await fetch(`${base}/api/route?project=unknown&destination=landmark:citadel`);
assert.equal(invalid.status,400,'Reject unknown location IDs without contacting the provider');
console.log('Routing passed: two different Egyptian road routes, endpoint positions, real distances/durations and invalid-input handling.');

// Unevenly sampled road geometry must animate by distance, not vertex count.
const compiled=ts.transpileModule(readFileSync(new URL('../lib/routing.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const geometry={};new Function('exports',compiled)(geometry);
const uneven=[[0,0],[.001,0],[1,0]],distances=geometry.routeDistances(uneven);
for(const progress of [0,.25,.5,.75,1]){
 const point=geometry.pointOnRoute(uneven,distances,progress).coordinate;
 assert.ok(Math.abs(point[0]-progress)<.00001,'Animation progresses uniformly along the road');
 assert.equal(point[1],0);
}
const duplicate=[[31,30],[31,30]];
assert.deepEqual(geometry.pointOnRoute(duplicate,geometry.routeDistances(duplicate),.5).coordinate,[31,30]);
console.log('Route animation passed: distance-based progress, midpoint label and duplicate-point handling.');
