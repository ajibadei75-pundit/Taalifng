/* Taalif NG | Portal: role-based demo login, dashboards, offline notice, install prompt. Demo auth only: replace with Supabase Auth + RLS. */
(function(){
var $=function(i){return document.getElementById(i)};
var R={learner:{n:'Learner',e:'learner@taalif.ng',v:['dash','apps','cbt','certs']},tutor:{n:'Tutor',e:'tutor@taalif.ng',v:['dash','cohorts','attend']},institution:{n:'Institution',e:'school@taalif.ng',v:['dash','staff','reports']},sponsor:{n:'Sponsor',e:'sponsor@taalif.ng',v:['dash','funds','impact']},admin:{n:'Administrator',e:'admin@taalif.ng',v:['dash','apps','progs','users','audit']}};
var L={dash:'Overview',apps:'Applications',cbt:'CBT practice',certs:'Certificates',cohorts:'My cohorts',attend:'Attendance',staff:'Staff',reports:'Reports',funds:'Contributions',impact:'Impact reports',progs:'Programmes',users:'Users and roles',audit:'Audit log'};
var S=null,sel='learner',cv='dash';
try{S=JSON.parse(sessionStorage.getItem('tq'))}catch(e){}
var A=[{r:'TNG-2026-0412',n:'Demo Learner',p:'Classroom management',s:'Under review'},{r:'TNG-2026-0413',n:'Amina Yusuf',p:'AI in the classroom',s:'Submitted'},{r:'TNG-2026-0414',n:'Tunde Bello',p:'JAMB UTME mock series',s:'Submitted'},{r:'TNG-2026-0415',n:'Grace Okoro',p:'Digital skills',s:'Waitlisted'}],AU=[];
function T(h,r){return '<div class="tw"><table><thead><tr>'+h.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr></thead><tbody>'+r.map(function(x){return '<tr>'+x.map(function(c){return '<td>'+c+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
function K(a){return '<div class="kp">'+a.map(function(x){return '<div class="k"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>'}).join('')+'</div>'}
function P(s){return '<span class="pill '+(s==='Approved'?'ok':s==='Rejected'?'no':'')+'">'+s+'</span>'}
function C(t,b){return '<div class="card" style="margin-bottom:16px"><h3>'+t+'</h3><p>'+b+'</p></div>'}
var V={
dash:function(){var d={learner:[['1','Open application'],['2','Mock exams taken'],['0','Certificates']],tutor:[['2','Assigned cohorts'],['48','Learners'],['3','Sessions this week']],institution:[['24','Staff invited'],['18','Accounts activated'],['1','Active cohort']],sponsor:[['₦2.5m','Contributed'],['40','Beneficiaries'],['2','Programmes funded']],admin:[[A.filter(function(a){return a.s==='Submitted'||a.s==='Under review'}).length,'Awaiting review'],[A.length,'Applications'],[5,'Users']]};return K(d[S.role])+C('Sample data','This prototype shows how each role sees only its own tools. Live data will come from the database.')},
apps:function(){var ad=S.role==='admin',l=A.map(function(a,i){return [a,i]}).filter(function(x){return ad||x[0].n==='Demo Learner'});return T(['Reference','Applicant','Programme','Status'].concat(ad?['Action']:[]),l.map(function(x){var a=x[0],i=x[1];return [a.r,a.n,a.p,P(a.s)].concat(ad?[(a.s==='Approved'||a.s==='Rejected')?'Done':'<button class="mini g" data-a="'+i+'" data-d="Approved">Approve</button><button class="mini" data-a="'+i+'" data-d="Rejected">Reject</button>']:[])}))},
cbt:function(){return T(['Paper','Subjects','Status'],[['JAMB UTME mock 1','English, Maths, Physics, Chemistry','Completed'],['JAMB UTME mock 2','English, Maths, Physics, Chemistry','Completed'],['WAEC practice','Mathematics','Not started']])+'<a class="btn" href="#top">Start a new mock</a>'},
certs:function(){return C('No certificates yet','Certificates appear here after you meet the completion rules for a programme. Each one has a QR code for public verification.')},
cohorts:function(){return T(['Cohort','Programme','Learners','Next session'],[['Oyo A','Classroom management','28','Tuesday 10:00'],['Ibadan B','Assessment and feedback','20','Thursday 14:00']])},
attend:function(){return C('Classroom management, Oyo A','Mark who attended today.')+['Amina Yusuf','Tunde Bello','Grace Okoro','Sade Lawal'].map(function(n){return '<label class="chk"><input type="checkbox"> '+n+'</label>'}).join('')},
staff:function(){return T(['Staff member','Email','Status'],[['Mrs. Adeyemi','adeyemi@school.ng','Active'],['Mr. Bakare','bakare@school.ng','Invited'],['Ms. Chukwu','chukwu@school.ng','Active']])},
reports:function(){return C('Training report','Attendance and completion by cohort, without unnecessary personal data.')},
funds:function(){return T(['Date','Programme','Amount','Status'],[['Sep 2026','Classroom management','₦1,500,000','Allocated'],['Oct 2026','Digital skills','₦1,000,000','Allocated']])},
impact:function(){return C('Impact summary','40 beneficiaries supported so far. Reports show totals, not individual details.')},
progs:function(){return T(['Programme','Audience','Funding','Status'],[['Classroom management','Educators','Sponsored','Published'],['AI in the classroom','Educators','Free','Published'],['JAMB UTME mock series','Students','Paid','Draft']])},
users:function(){return T(['Name','Email','Role','Status'],[['Demo Learner','learner@taalif.ng','Learner','Active'],['Ada Eze','tutor@taalif.ng','Tutor','Active'],['Oyo Model School','school@taalif.ng','Institution','Verified'],['Bright Future Fund','sponsor@taalif.ng','Sponsor','Active'],['Taalif Admin','admin@taalif.ng','Administrator','Active']])},
audit:function(){return AU.length?T(['Time','Actor','Action'],AU):C('No actions yet','Approve or reject an application and it will be recorded here.')}};
function render(){var r=R[S.role];$('pttl').textContent=L[cv];$('sn').innerHTML=r.v.map(function(v){return '<button type="button" data-v="'+v+'"'+(v===cv?' aria-current="page"':'')+'>'+L[v]+'</button>'}).join('');$('su').textContent=r.n+': '+S.email;$('pc').innerHTML=r.v.indexOf(cv)<0?C('Access denied','Your role cannot open this page.'):V[cv]()}
function side(o){$('sb').classList.toggle('open',o);$('ov').hidden=!o}
function route(){var h=location.hash.slice(1);if(h==='portal'&&!S){location.hash='login';return}if(h==='login'&&S){location.hash='portal';return}var p=h==='portal',a=h==='login';$('site').hidden=p||a;$('auth').hidden=!a;$('portal').hidden=!p;document.body.classList.toggle('inportal',p);if(p){side(false);render();scrollTo(0,0)}else if(a){scrollTo(0,0)}else{var el=h&&$(h);if(el)el.scrollIntoView()}}
function roles(){$('rl').innerHTML=Object.keys(R).map(function(k){return '<button type="button" class="chip" data-r="'+k+'" aria-pressed="'+(k===sel)+'">'+R[k].n+'</button>'}).join('');$('em').value=R[sel].e}
$('rl').onclick=function(e){var b=e.target.closest('[data-r]');if(b){sel=b.dataset.r;roles()}};
$('lf').onsubmit=function(e){e.preventDefault();if($('em').value.trim().toLowerCase()===R[sel].e&&$('pw').value==='demo1234'){S={role:sel,email:R[sel].e};try{sessionStorage.setItem('tq',JSON.stringify(S))}catch(x){}cv='dash';$('pw').value='';$('le').textContent='';location.hash='portal'}else $('le').textContent='The email or password is incorrect for the selected role.'};
$('sn').onclick=function(e){var b=e.target.closest('[data-v]');if(b){cv=b.dataset.v;render();side(false)}};
$('pc').onclick=function(e){var b=e.target.closest('[data-a]');if(b&&S.role==='admin'){var a=A[b.dataset.a];a.s=b.dataset.d;AU.unshift([new Date().toLocaleTimeString(),S.email,a.r+' '+a.s.toLowerCase()]);render()}};
$('sbt').onclick=function(){side(true)};$('ov').onclick=function(){side(false)};
$('tgp').onclick=function(){document.getElementById('tg').click()};
$('lo').onclick=function(){S=null;try{sessionStorage.removeItem('tq')}catch(x){}location.hash='login'};
roles();addEventListener('hashchange',route);route();
function net(){$('off').hidden=navigator.onLine}addEventListener('online',net);addEventListener('offline',net);net();
var dp;addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;$('inst').hidden=false});$('inst').onclick=function(){if(dp){dp.prompt();dp=null;$('inst').hidden=true}};
})();