/* Taalif NG | Supabase layer: real sign-in, applications, counselling, messages and admin updates. Falls back to demo mode when not configured. */
(function(){
var c=window.TAALIF||{},on=!!(c.supabaseUrl&&c.supabaseKey),cl=(on&&window.supabase)?window.supabase.createClient(c.supabaseUrl,c.supabaseKey):null;
function need(){return cl?null:Promise.reject(new Error('unavailable'))}
var T={application:'applications',counselling:'bookings',message:'messages'};
var M={applications:function(o,u){return{ref:o.r,user_id:u,name:o.n,email:o.e,phone:o.ph||null,applicant_type:o.w,programme:o.p,status:'Submitted'}},
bookings:function(o,u){return{ref:o.r,user_id:u,name:o.n,email:o.e,phone:o.ph||null,type:o.ty,mode:o.md,preferred_date:o.d||null,message:o.m||null,status:'Requested'}},
messages:function(o){return{name:o.n,email:o.e,role:o.r,message:o.m}}};
TQ.db={on:on,
submit:function(kind,o){var t=T[kind];if(!on||!t||!cl)return;cl.auth.getSession().then(function(s){var u=s.data&&s.data.session?s.data.session.user.id:null;return cl.from(t).insert(M[t](o,u))}).catch(function(){})},
signIn:function(e,p){return need()||cl.auth.signInWithPassword({email:e,password:p})},
signUp:function(e,p,n){return need()||cl.auth.signUp({email:e,password:p,options:{data:{full_name:n}}})},
signOut:function(){if(cl)cl.auth.signOut()},
who:function(){return need()||cl.auth.getUser().then(function(r){var u=r.data&&r.data.user;if(!u)return null;return cl.from('user_roles').select('role').eq('user_id',u.id).then(function(q){var rs=(q.data||[]).map(function(x){return x.role}),role=['admin','counsellor','tutor','institution','sponsor','learner'].filter(function(x){return rs.indexOf(x)>-1})[0]||'learner';return{id:u.id,email:u.email,role:role}})})},
pull:function(role){if(!cl)return Promise.resolve();var q=function(t){return cl.from(t).select('*').order('created_at',{ascending:false})};
return Promise.all([q('applications'),q('bookings'),role==='admin'?q('messages'):Promise.resolve({data:[]})]).then(function(x){
TQ.save('apps',(x[0].data||[]).map(function(a){return{r:a.ref,n:a.name,e:a.email,p:a.programme,s:a.status}}));
TQ.save('bookings',(x[1].data||[]).map(function(b){return{r:b.ref,n:b.name,e:b.email,ph:b.phone,ty:b.type,md:b.mode,d:b.preferred_date,m:b.message,s:b.status}}));
TQ.save('messages',(x[2].data||[]).map(function(m){return{n:m.name,e:m.email,r:m.role,m:m.message}}))}).catch(function(){})},
setStatus:function(t,ref,s){if(cl)cl.from(t).update({status:s}).eq('ref',ref).then(function(){})}};
})();
