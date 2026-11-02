/* Taalif NG | Public site: theme toggle, programme filter, CBT demo, contact form, mobile menu */
(function(){
var root=document.documentElement,tg=document.getElementById('tg'),ti=document.getElementById('ti'),tt=document.getElementById('tt');
function cur(){var t=root.getAttribute('data-theme');return t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}
function paint(){var d=cur()==='dark';ti.textContent=d?'☀':'☾';tt.textContent=d?'Day':'Night';tg.setAttribute('aria-label',d?'Switch to day mode':'Switch to night mode')}
try{var s=localStorage.getItem('taalif-theme');if(s)root.setAttribute('data-theme',s)}catch(e){}
paint();
tg.onclick=function(){var n=cur()==='dark'?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('taalif-theme',n)}catch(e){}paint()};

var P=[
{t:'Effective classroom management',a:'edu',f:'spons',d:'Practical routines for large classes.',m:'Hybrid · 4 weeks · Oyo State'},
{t:'Assessment and feedback for teachers',a:'edu',f:'paid',d:'Design fair tests and give useful feedback.',m:'Online · 3 weeks'},
{t:'AI in the classroom',a:'edu',f:'free',d:'Use AI tools safely for planning and marking.',m:'Online · 2 weeks'},
{t:'JAMB UTME mock series',a:'stu',f:'paid',d:'Timed full-length mocks with subject analysis.',m:'Online · Self-paced'},
{t:'Study skills and career pathways',a:'stu',f:'free',d:'Habits, goal-setting and guidance for school leavers.',m:'In person and online'},
{t:'Digital skills: Office and data basics',a:'stu',f:'spons',d:'Hands-on Microsoft Office and spreadsheets.',m:'Hybrid · 6 weeks'}];
var L={free:'Free',paid:'Paid',spons:'Sponsored'},pl=document.getElementById('pl');
function render(f){pl.innerHTML='';P.filter(function(p){return f==='all'||p.a===f||p.f===f}).forEach(function(p){
var c=document.createElement('article');c.className='card prog';
c.innerHTML='<div><span class="tag">'+(p.a==='edu'?'Educators':'Students')+'</span><span class="tag gold">'+L[p.f]+'</span></div><h3>'+p.t+'</h3><p>'+p.d+'</p><div class="meta">'+p.m+'</div><a class="btn" href="#contact">Register interest</a>';
pl.appendChild(c)})}
render('all');
document.querySelectorAll('.chip').forEach(function(b){b.onclick=function(){document.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');render(b.dataset.f)}});

var Q=[{q:'Solve for x: 2x + 6 = 14',o:['3','4','5','8'],a:1,e:'2x = 8, so x = 4.'},
{q:'What is 25% of 240?',o:['40','50','60','80'],a:2,e:'240 × 0.25 = 60.'},
{q:'Simplify 3² + 4²',o:['14','25','49','7'],a:1,e:'9 + 16 = 25.'}],i=0,sc=0,ops=document.getElementById('ops'),fb=document.getElementById('fb'),pb=document.getElementById('pb'),tm=document.getElementById('tm'),qq=document.getElementById('q');
function show(){var x=Q[i];qq.textContent=x.q;tm.textContent='Question '+(i+1)+' of '+Q.length;pb.style.width=((Q.length-i)/Q.length*100)+'%';ops.innerHTML='';fb.textContent='Choose an answer.';
x.o.forEach(function(t,k){var b=document.createElement('button');b.className='opt';b.type='button';b.innerHTML='<span>'+'ABCD'[k]+'</span>'+t;b.onclick=function(){pick(k)};ops.appendChild(b)})}
function pick(k){var x=Q[i],bs=ops.children;for(var j=0;j<bs.length;j++){bs[j].disabled=true}
bs[x.a].classList.add('ok');if(k!==x.a)bs[k].classList.add('no');else sc++;
fb.textContent=(k===x.a?'Correct. ':'Not quite. ')+x.e;
setTimeout(function(){i++;if(i<Q.length)show();else{qq.textContent='You scored '+sc+' of '+Q.length;ops.innerHTML='<a class="btn" href="#programmes">See CBT programmes</a>';fb.textContent='Mock scores are for practice and are not official results.';pb.style.width='0';tm.textContent='Finished';setTimeout(function(){i=0;sc=0;show()},9000)}},2200)}
show();

var mb=document.getElementById('mb'),mn=document.getElementById('mn');
function menu(o){mn.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu')}
mb.onclick=function(){menu(!mn.classList.contains('open'))};
mn.querySelectorAll('a').forEach(function(a){a.onclick=function(){menu(false)}});
document.getElementById('cf').onsubmit=function(e){e.preventDefault();document.getElementById('toast').textContent='Thank you. Your message has been recorded for review.';this.reset()};
})();
