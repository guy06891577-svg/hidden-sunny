const STAGES=[
 {name:'베란다',img:'img/stage1.jpg',tip:'화분, 바구니, 자루, 빨래, 물뿌리개 속을 살펴보세요.',hits:[{x:125,y:231,r:34},{x:281,y:181,r:34},{x:537,y:312,r:34},{x:175,y:718,r:34},{x:293,y:768,r:34},{x:487,y:693,r:34},{x:506,y:843,r:34},{x:200,y:1025,r:34},{x:606,y:1050,r:34}]},
 {name:'욕실',img:'img/stage2.jpg',tip:'욕조, 커튼, 수건, 휴지 더미, 세면대 아래를 살펴보세요.',hits:[{x:137,y:231,r:34},{x:318,y:206,r:34},{x:500,y:400,r:34},{x:156,y:581,r:34},{x:356,y:587,r:34},{x:468,y:568,r:34},{x:662,y:343,r:34},{x:587,y:787,r:34},{x:331,y:1018,r:34}]},
 {name:'빨래방',img:'img/stage3.jpg',tip:'세탁기, 다리미판, 빨래 더미, 바구니를 살펴보세요.',hits:[{x:106,y:318,r:34},{x:125,y:550,r:34},{x:275,y:537,r:34},{x:362,y:625,r:34},{x:487,y:675,r:34},{x:181,y:775,r:34},{x:81,y:887,r:34},{x:112,y:1012,r:34},{x:118,y:1106,r:34},{x:487,y:956,r:34}]},
 {name:'서재',img:'img/stage4.jpg',tip:'책 더미, 서랍, 상자, 의자 밑, 종이 뭉치 사이를 살펴보세요.',hits:[{x:175,y:350,r:34},{x:331,y:81,r:34},{x:575,y:612,r:34},{x:431,y:718,r:34},{x:512,y:925,r:34},{x:268,y:937,r:34},{x:193,y:981,r:34},{x:412,y:1037,r:34},{x:262,y:1106,r:34},{x:362,y:1112,r:34}]},
 {name:'현관',img:'img/stage5.jpg',tip:'코트, 우산꽂이, 신발장, 장갑과 운동화 더미를 살펴보세요.',hits:[{x:137,y:300,r:34},{x:506,y:350,r:34},{x:662,y:312,r:34},{x:550,y:481,r:34},{x:112,y:656,r:34},{x:156,y:687,r:34},{x:412,y:637,r:34},{x:468,y:762,r:34},{x:512,y:806,r:34},{x:237,y:925,r:34}]},
 {name:'거실',img:'img/stage6.jpg',tip:'책장 칸칸이, 소파, 바구니, 화분, 탁자 주변을 살펴보세요.',hits:[{x:218,y:118,r:34},{x:231,y:225,r:34},{x:375,y:218,r:34},{x:550,y:256,r:34},{x:681,y:387,r:34},{x:600,y:700,r:34},{x:143,y:750,r:34},{x:487,y:850,r:34},{x:75,y:900,r:34},{x:137,y:1106,r:34},{x:612,y:1156,r:34},{x:206,y:368,r:34},{x:412,y:362,r:34}]},
 {name:'부엌',img:'img/stage7.jpg',tip:'냉장고 위, 바구니, 냄비, 그릇, 서랍, 쌀자루를 살펴보세요.',hits:[{x:512,y:168,r:34},{x:231,y:500,r:34},{x:306,y:537,r:34},{x:525,y:612,r:34},{x:656,y:643,r:34},{x:287,y:675,r:34},{x:50,y:812,r:34},{x:481,y:818,r:34},{x:381,y:906,r:34},{x:637,y:818,r:34},{x:356,y:1006,r:34},{x:318,y:1062,r:34},{x:300,y:1200,r:34}]},
 {name:'침실',img:'img/stage8.jpg',tip:'옷장, 서랍, 이불 속, 침대 밑, 옷더미, 상자를 살펴보세요.',hits:[{x:668,y:312,r:34},{x:337,y:406,r:34},{x:175,y:500,r:34},{x:506,y:593,r:34},{x:156,y:600,r:34},{x:331,y:831,r:34},{x:412,y:856,r:34},{x:200,y:843,r:34},{x:412,y:950,r:34},{x:100,y:962,r:34},{x:125,y:1100,r:34},{x:662,y:831,r:34},{x:525,y:1125,r:34},{x:137,y:412,r:34},{x:218,y:1075,r:34}]}];
'use strict';
const NS='http://www.w3.org/2000/svg',svg=document.getElementById('scene'),world=document.getElementById('world'),$=id=>document.getElementById(id);
const W=720,H=1280,LIMIT=180,HINTS=3,MAXZ=4,MIN_TAP_CSS=20;
function el(t,a,p=world){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
STAGES.forEach(s=>{new Image().src=s.img});new Image().src='img/sunny.png';
let si=0,got=[],left=LIMIT,timer=0,done=false,hints=HINTS,misses=[],lockUntil=0,total=0;
// ---- view (zoom/pan via viewBox) ----
let V={x:0,y:0,w:W,h:H},Z=1;
function setView(){const r=svg.getBoundingClientRect(),asp=r.width/r.height;
 // base fit: whole image visible (meet). viewBox aspect follows screen so pan bounds are simple
 let fw,fh;if(asp<W/H){fw=W;fh=W/asp}else{fh=H;fw=H*asp}
 const w=fw/Z,h=fh/Z;V.w=w;V.h=h;
 const minx=Math.min(0,(W-w)/2),maxx=Math.max(W-w,(W-w)/2),miny=Math.min(0,(H-h)/2),maxy=Math.max(H-h,(H-h)/2);
 V.x=Math.min(Math.max(V.x,minx),maxx);V.y=Math.min(Math.max(V.y,miny),maxy);
 svg.setAttribute('viewBox',`${V.x} ${V.y} ${V.w} ${V.h}`)}
function fit(){Z=1;V.x=-1e9;V.y=-1e9;const r=svg.getBoundingClientRect(),asp=r.width/r.height;setView();V.x=(W-V.w)/2;V.y=(H-V.h)/2;setView()}
function toImg(cx,cy){const r=svg.getBoundingClientRect();return{x:V.x+(cx-r.left)/r.width*V.w,y:V.y+(cy-r.top)/r.height*V.h}}
function zoomAt(cx,cy,nz){nz=Math.min(MAXZ,Math.max(1,nz));const p=toImg(cx,cy),r=svg.getBoundingClientRect();Z=nz;setView();
 V.x=p.x-(cx-r.left)/r.width*V.w;V.y=p.y-(cy-r.top)/r.height*V.h;setView()}
function cssPerImg(){return svg.getBoundingClientRect().width/V.w}
// ---- pointers: tap / drag / pinch ----
const P=new Map();let drag=null,pinch=null,moved=false;
svg.addEventListener('pointerdown',e=>{svg.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(P.size===1){drag={x:e.clientX,y:e.clientY,vx:V.x,vy:V.y};moved=false}
 else if(P.size===2){const [a,b]=[...P.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:Z};moved=true}});
svg.addEventListener('pointermove',e=>{if(!P.has(e.pointerId))return;P.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(P.size>=2&&pinch){const [a,b]=[...P.values()];zoomAt((a.x+b.x)/2,(a.y+b.y)/2,pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d)}
 else if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>8)moved=true;
  if(moved){const k=1/cssPerImg();V.x=drag.vx-dx*k;V.y=drag.vy-dy*k;setView()}}});
function up(e){if(!P.has(e.pointerId))return;P.delete(e.pointerId);
 if(P.size===0){if(!moved&&drag)tap(e.clientX,e.clientY);drag=null;pinch=null}
 else if(P.size===1){const [a]=[...P.values()];drag={x:a.x,y:a.y,vx:V.x,vy:V.y};pinch=null}}
svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',e=>{P.delete(e.pointerId);if(!P.size){drag=null;pinch=null}});
svg.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,Z*(e.deltaY<0?1.2:1/1.2))},{passive:false});
svg.addEventListener('dblclick',e=>zoomAt(e.clientX,e.clientY,Z<2?2.5:1));
$('zin').onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,Z*1.5)};
$('zout').onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,Z/1.5)};
$('zfit').onclick=fit;addEventListener('resize',setView);
// ---- game ----
const fmt=s=>`${s/60|0}:${String(Math.max(0,s)%60|0).padStart(2,'0')}`;
function hud(){const s=STAGES[si];$('count').textContent=`🐱 ${got.filter(Boolean).length}/${s.hits.length}`;$('timer').textContent='⏱ '+fmt(Math.max(0,Math.ceil(left)));
 $('timer').classList.toggle('low',left<=30);$('hint').textContent='💡'+hints;$('hint').disabled=hints<=0||done}
function load(i){si=i;const s=STAGES[i];world.innerHTML='';el('image',{href:s.img,x:0,y:0,width:W,height:H});
 got=s.hits.map(()=>false);left=LIMIT;hints=HINTS;misses=[];done=false;$('bgblur').style.backgroundImage=`url(${s.img})`;
 $('stage').textContent=`${i+1}/${STAGES.length} ${s.name}`;$('msg').textContent=`써니 ${s.hits.length}마리를 찾으세요! 핀치로 확대, 드래그로 이동.`;
 fit();hud();clearInterval(timer);let last=performance.now();
 timer=setInterval(()=>{const n=performance.now();left-=(n-last)/1000;last=n;hud();if(left<=0)fail()},250)}
function tap(cx,cy){if(done)return;const now=performance.now();if(now<lockUntil)return;
 const p=toImg(cx,cy),H2=STAGES[si].hits,tol=MIN_TAP_CSS/cssPerImg();let k=-1,bd=1e9;
 H2.forEach((h,j)=>{const d=Math.hypot(p.x-h.x,p.y-h.y);if(!got[j]&&d<=Math.max(h.r,tol)&&d<bd){bd=d;k=j}});
 if(k>=0)found(k);else miss(p,now)}
function found(k){const h=STAGES[si].hits[k];got[k]=true;hud();if(navigator.vibrate)navigator.vibrate(50);
 el('circle',{cx:h.x,cy:h.y,r:h.r,fill:'none',stroke:'#ffd166','stroke-width':8,class:'ring','pointer-events':'none'});
 el('circle',{cx:h.x,cy:h.y,r:h.r,fill:'none',stroke:'#ffb703','stroke-width':4,'pointer-events':'none'});
 setTimeout(()=>{const w=64,ht=w*400/243;const g=el('g',{class:'pop','pointer-events':'none'});el('image',{href:'img/sunny.png',x:h.x-w/2,y:h.y-ht-h.r+12,width:w,height:ht},g)},250);
 if(got.every(Boolean))win();else $('msg').textContent=`찾았다! 남은 써니 ${got.filter(x=>!x).length}마리`}
function miss(p,now){const s=10/Math.sqrt(Z);const m=el('path',{d:`M${p.x-s} ${p.y-s}L${p.x+s} ${p.y+s}M${p.x+s} ${p.y-s}L${p.x-s} ${p.y+s}`,stroke:'#e63946','stroke-width':4/Math.sqrt(Z)+1,'stroke-linecap':'round',class:'miss','pointer-events':'none'});
 setTimeout(()=>m.remove(),800);if(navigator.vibrate)navigator.vibrate(15);
 misses=misses.filter(t=>now-t<2000);misses.push(now);
 if(misses.length>=3){misses=[];left-=5;lockUntil=now+1000;hud();$('msg').textContent='⚠️ 마구 누르기 감지! -5초 (1초간 탭 잠금)';if(left<=0)fail()}}
function stars(){const used=LIMIT-left;return used<=60?3:used<=120?2:1}
function win(){done=true;clearInterval(timer);const used=Math.round(LIMIT-left),st=stars();total+=used;hud();$('msg').textContent='모두 찾았다! 🎉';
 setTimeout(()=>{const last=si===STAGES.length-1;$('otitle').textContent=last?'모든 써니를 찾았어요! 🐾':'스테이지 클리어! 🐱';$('stars').textContent='★'.repeat(st)+'☆'.repeat(3-st);
  $('otext').textContent=`기록 ${fmt(used)}`+(last?` · 총 ${fmt(total)}`:'');$('retry').classList.add('hidden');$('next').classList.remove('hidden');$('next').textContent=last?'처음부터':'다음 스테이지';$('overlay').classList.remove('hidden')},1400)}
function fail(){if(done)return;done=true;clearInterval(timer);left=0;hud();
 $('otitle').textContent='시간 초과! ⏰';$('stars').textContent='☆☆☆';$('otext').textContent=`찾은 써니 ${got.filter(Boolean).length}/${got.length}`;
 $('retry').classList.remove('hidden');$('next').classList.add('hidden');$('overlay').classList.remove('hidden')}
$('hint').onclick=()=>{if(done||hints<=0)return;const idx=got.indexOf(false);if(idx<0)return;hints--;hud();const h=STAGES[si].hits[idx];
 $('msg').textContent='힌트: '+STAGES[si].tip;const c=el('circle',{cx:h.x+(Math.random()-.5)*70,cy:h.y+(Math.random()-.5)*70,r:85,fill:'#ffd16640',stroke:'#ff9f1c','stroke-width':8,class:'pulse','pointer-events':'none'});setTimeout(()=>c.remove(),3000)};
$('next').onclick=()=>{$('overlay').classList.add('hidden');if(si===STAGES.length-1){total=0;load(0)}else load(si+1)};
$('retry').onclick=()=>{$('overlay').classList.add('hidden');load(si)};
load(0);
