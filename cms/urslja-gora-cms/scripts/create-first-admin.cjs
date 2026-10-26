'use strict';
// Run while the normal CMS is stopped. Credentials arrive through stdin only.
const fs=require('node:fs'),path=require('node:path');
const {createStrapi}=require('@strapi/strapi');
(async()=>{const credentials=JSON.parse(fs.readFileSync(0,'utf8'));
if(typeof credentials.email!=='string'||!/^\S+@\S+\.\S+$/.test(credentials.email)||typeof credentials.password!=='string'||credentials.password.length<16)throw new Error('invalid credentials');
const app=await createStrapi({distDir:path.resolve('dist')}).load();try{
if(await app.db.query('admin::user').count())throw new Error('administrator already exists');
const role=await app.db.query('admin::role').findOne({where:{code:'strapi-super-admin'}});
if(!role)throw new Error('administrator role is missing');
await app.admin.services.user.create({email:credentials.email,password:credentials.password,firstname:credentials.firstname||'Website',lastname:credentials.lastname||'Owner',isActive:true,roles:[role.id]});
// Strapi starts an asynchronous administrator metrics query after create().
// Let that internal hook settle before destroying its database connection.
await new Promise(resolve=>setTimeout(resolve,1000));
console.log('First administrator created. No password was written to a file or command-line argument.');
}finally{await app.destroy()}})().catch(()=>{console.error('Administrator creation refused or failed. Verify the private input and that this new database has no administrators.');process.exitCode=1});
