const test=require('node:test'),assert=require('node:assert/strict');
const production=require('../config/env/production/middlewares.ts').default;
const server=require('../config/env/production/server.ts').default;
const plugins=require('../config/env/production/plugins.ts').default;
const media=require('../src/middlewares/cloud-media-safety.ts').default;
const {ensureCloudOwner}=require('../src/utils/cloud-first-admin.ts');
function env(values={}){const read=(k,d)=>Object.hasOwn(values,k)?values[k]:d;read.array=(k,d=[])=>read(k,d);read.int=(k,d)=>Number(read(k,d));read.bool=(k,d)=>read(k,d);return read;}
test('Cloud keeps the complete moderation and middleware chain with exact CORS',()=>{
 const m=production({env:env()}),names=m.map(x=>typeof x==='string'?x:x.name);
 for(const name of ['strapi::errors','strapi::security','strapi::cors','strapi::body','strapi::session','strapi::public','global::community-limits','global::media-approval','global::cloud-media-safety'])assert(names.includes(name));
 assert.deepEqual(m.find(x=>x.name==='strapi::cors').config.origin,['https://urslja-gora.vercel.app']);
 assert(names.indexOf('global::cloud-media-safety')<names.indexOf('strapi::public'));
 assert(names.indexOf('global::cloud-media-safety')<names.indexOf('strapi::body'));
});
test('Cloud rejects wildcard, insecure, empty and non-origin CORS settings',()=>{
 for(const origins of [[],['*'],['https://*.vercel.app'],['http://site.example'],['https://site.example/path']])assert.throws(()=>production({env:env({CORS_ORIGINS:origins})}));
});
test('Cloud listens externally, uses managed uploads and defaults to remote transfer off',()=>{
 const s=server({env:env()}),p=plugins({env:env()});assert.equal(s.host,'0.0.0.0');assert.equal(s.transfer.remote.enabled,false);assert.equal(p.upload.config.provider,'local');assert.equal(p.cloud.enabled,false);
 assert.equal(server({env:env({CLOUD_TRANSFER_ENABLED:true})}).transfer.remote.enabled,true);
});
function context(path,files={},method='POST'){return{path,method,request:{files},headers:{},set(k,v){this.headers[k]=v},forbidden(){this.status=403},badRequest(){this.status=400}};}
test('unverified Cloud CDN cannot expose new anonymous images or registration aliases',async()=>{
 const middleware=media({}, {strapi:{config:{get:()=>false}}});
 for(const path of ['/api/upload','/API/UPLOAD/','/api/%75pload','/api/other/../upload','/api/mapa-fotografijas','/api/pohvalas']){
  const c=context(path,{files:{filepath:'unused'}});let called=false;await middleware(c,async()=>called=true);assert.equal(c.status,503,path);assert.equal(called,false);assert.equal(c.headers['Cache-Control'],'no-store');
 }
 for(const path of ['/api/auth/local/register/','/API/AUTH/LOCAL/REGISTER','/api/auth/local/%72egister']){const c=context(path);await middleware(c,async()=>assert.fail());assert.equal(c.status,403);}
});
test('normal editor uploads, reads and text-only praise remain available',async()=>{
 const middleware=media({}, {strapi:{config:{get:()=>false}}});
 for(const c of [context('/upload',{files:{}}),context('/api/pohvalas'),context('/api/novicas',{},'GET')]){let called=false;await middleware(c,async()=>called=true);assert(called);}
});
test('anonymous multipart images are rejected before parsing or temporary upload writes',async()=>{
 const middleware=media({}, {strapi:{config:{get:()=>false}}}),c=context('/api/pohvalas');
 c.request.headers={'content-type':'multipart/form-data; boundary=example'};let parsed=false;
 await middleware(c,async()=>parsed=true);assert.equal(c.status,503);assert.equal(parsed,false);
});
test('only a server-side verified media configuration enables anonymous images',async()=>{
 for(const value of [undefined,false,'true',1,true]){
  const middleware=media({}, {strapi:{config:{get:()=>value}}}),c=context('/api/upload',{files:{}});let called=false;await middleware(c,async()=>called=true);assert.equal(called,value===true);
 }
});
function ownerApp(count=0){const created=[];return{created,db:{query(uid){return uid==='admin::user'?{count:async()=>count}:{findOne:async()=>({id:1})}}},admin:{services:{user:{create:async data=>created.push(data)}}}};}
test('existing administrators are never replaced or reset by Cloud bootstrap',async()=>{
 const app=ownerApp(1);assert.equal(await ensureCloudOwner(app,{}),false);assert.equal(app.created.length,0);
});
test('empty Cloud project refuses weak or missing credentials before opening HTTP',async()=>{
 for(const credentials of [{},{CLOUD_BOOTSTRAP_ADMIN_EMAIL:'bad',CLOUD_BOOTSTRAP_ADMIN_PASSWORD:'x'.repeat(32)},{CLOUD_BOOTSTRAP_ADMIN_EMAIL:'owner@example.invalid',CLOUD_BOOTSTRAP_ADMIN_PASSWORD:'short'}]){
  const app=ownerApp();await assert.rejects(()=>ensureCloudOwner(app,credentials));assert.equal(app.created.length,0);
 }
});
test('only the first privately configured owner is created, with the administrator role',async()=>{
 const app=ownerApp();assert.equal(await ensureCloudOwner(app,{CLOUD_BOOTSTRAP_ADMIN_EMAIL:'owner@example.invalid',CLOUD_BOOTSTRAP_ADMIN_PASSWORD:'x'.repeat(32)}),true);
 assert.equal(app.created.length,1);assert.deepEqual(app.created[0].roles,[1]);assert.equal(app.created[0].isActive,true);
});
