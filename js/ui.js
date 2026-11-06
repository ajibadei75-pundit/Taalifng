/* Taalif NG | UI: header scroll-spy and the rotating highlights slideshow */
(function(){
var $=function(i){return document.getElementById(i)},rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* scroll-spy: highlight the nav link of the section in view */
var links=[].slice.call(document.querySelectorAll('nav#mn a[href^="#"]')),map={};
links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[x.target.id];if(a)a.classList.add('on')}})},{rootMargin:'-45% 0px -50% 0px'});Object.keys(map).forEach(function(id){var s=$(id);if(s)so.observe(s)})}
/* slideshow */
var S=[{i:'images/s1.svg',h:'Teachers who keep growing',p:'Practical training in pedagogy, assessment and classroom management for educators across Nigeria.',a:'See educator programmes',l:'#programmes'},
{i:'images/s2.svg',h:'Practise like it is exam day',p:'Timed CBT mocks with instant results and topic-by-topic feedback.',a:'Try Course Match',l:'#match'},
{i:'images/s3.svg',h:'Find the right course and your next opportunity',p:'Check subject requirements, careers and scholarships before you choose.',a:'Open Course Compass',l:'#compass'},
{i:'images/s4.svg',h:'Learning rooted in knowledge and faith',p:'Study guides, templates and Islamic Academy resources in one library.',a:'Open the library',l:'#resources'}],n=0,t,im=[$('si1'),$('si2')],top=0;
if(!im[0])return;
$('sld').innerHTML=S.map(function(s,i){return '<button type="button" class="dot" data-d="'+i+'" aria-label="Show slide '+(i+1)+'"></button>'}).join('');
function show(i){n=(i+S.length)%S.length;var s=S[n],nx=im[1-top];nx.src=s.i;nx.classList.add('on');im[top].classList.remove('on');top=1-top;
$('slt').innerHTML='<h2>'+s.h+'</h2><p>'+s.p+'</p><a class="btn" href="'+s.l+'">'+s.a+'</a>';
[].forEach.call(document.querySelectorAll('.dot'),function(d,k){d.setAttribute('aria-current',k===n)})}
function auto(){clearInterval(t);if(!rm)t=setInterval(function(){show(n+1)},6000)}
$('slp').onclick=function(){show(n-1);auto()};$('sln').onclick=function(){show(n+1);auto()};
$('sld').onclick=function(e){var d=e.target.closest('[data-d]');if(d){show(+d.dataset.d);auto()}};
var sh=$('showcase');sh.onmouseenter=sh.onfocusin=function(){clearInterval(t)};sh.onmouseleave=sh.onfocusout=auto;
im[0].src=S[0].i;im[0].classList.add('on');show(0);auto();
})();
