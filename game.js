'use strict';
const NS='http://www.w3.org/2000/svg',svg=document.getElementById('scene'),$=id=>document.getElementById(id);
function el(t,a,p=svg){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
// Stages: background image is 720x1280 (9:16). Hit region in image coordinates.
const STAGES=[
 {name:'거실',img:'img/stage1.jpg',tip:'소파, 바구니, 화분, 탁자 주변을 살펴보세요.',hits:[{x:431,y:850,r:42},{x:88,y:438,r:40},{x:706,y:381,r:40},{x:600,y:1119,r:40},{x:81,y:919,r:42}]},
 {name:'부엌',img:'img/stage2.jpg',tip:'냉장고, 찬장, 냄비, 식탁 주변을 살펴보세요.',hits:[{x:156,y:269,r:45},{x:422,y:188,r:40},{x:546,y:412,r:50},{x:460,y:625,r:50},{x:494,y:950,r:45}]},
 {name:'빨래방',img:'img/stage3.jpg',tip:'빨래 바구니, 베개, 상자 주변을 잘 보세요.',hits:[{x:500,y:600,r:50},{x:175,y:794,r:55},{x:506,y:881,r:45},{x:181,y:1144,r:55},{x:644,y:988,r:50}]},
 {name:'침실',img:'img/stage4.jpg',tip:'침대 베개, 옷장, 서랍장, 의자 위 옷더미를 살펴보세요.',hits:[{x:191,y:331,r:42},{x:431,y:400,r:55},{x:347,y:425,r:40},{x:137,y:862,r:50},{x:368,y:875,r:50},{x:606,y:768,r:50}]},
 {name:'서재',img:'img/stage5.jpg',tip:'책 더미, 책장, 책상 서랍, 상자, 화분을 살펴보세요.',hits:[{x:347,y:343,r:50},{x:331,y:112,r:47},{x:493,y:731,r:56},{x:400,y:843,r:56},{x:531,y:1018,r:56},{x:225,y:119,r:45},{x:612,y:1144,r:50}]},
 {name:'욕실',img:'img/stage6.jpg',tip:'욕조 거품, 샤워커튼, 수건, 세면대, 빨래통을 살펴보세요.',hits:[{x:331,y:481,r:45},{x:77,y:568,r:45},{x:147,y:643,r:48},{x:81,y:702,r:48},{x:290,y:693,r:48},{x:525,y:762,r:45},{x:143,y:1037,r:50}]},
 {name:'베란다',img:'img/stage7.jpg',tip:'화분, 벤치, 물뿌리개, 빨래 건조대를 살펴보세요.',hits:[{x:175,y:518,r:56},{x:587,y:256,r:56},{x:287,y:887,r:52},{x:460,y:862,r:47},{x:612,y:550,r:47}]},
 {name:'현관',img:'img/stage8.jpg',tip:'코트, 벤치 밑, 상자, 가방 속을 살펴보세요.',hits:[{x:335,y:419,r:45},{x:344,y:656,r:45},{x:590,y:750,r:45},{x:552,y:797,r:42},{x:652,y:956,r:50},{x:125,y:1125,r:50}]}];
STAGES.forEach(s=>{new Image().src=s.img});new Image().src='img/sunny.png';
let si=0,t0=0,timer=0,found=false,total=0,got=[];
function cnt(){$('count').textContent=`찾은 써니 ${got.filter(Boolean).length}/${STAGES[si].hits.length}`}
const fmt=s=>`${s/60|0}:${String(s%60).padStart(2,'0')}`;
function load(i){si=i;found=false;svg.innerHTML='';const s=STAGES[i];got=s.hits.map(()=>false);cnt();$('bgblur').style.backgroundImage=`url(${s.img})`;
 el('image',{href:s.img,x:0,y:0,width:720,height:1280});
 $('stage').textContent=`${i+1}/${STAGES.length} ${s.name}`;$('msg').textContent='써니가 어딘가 숨어 있어요! 꼬리나 귀를 찾아 탭하세요.';
 t0=Date.now();clearInterval(timer);tick();timer=setInterval(tick,500)}
function tick(){$('timer').textContent='⏱ '+fmt((Date.now()-t0)/1000|0)}
function pt(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
function reveal(h){const w=110,ht=w*400/279,x=Math.min(Math.max(h.x-w/2,10),710-w),y=Math.max(h.y-ht+20,10);
 const g=el('g',{class:'pop'});el('ellipse',{cx:x+w/2,cy:y+ht-10,rx:w*.45,ry:8,fill:'#0003'},g);el('image',{href:'img/sunny.png',x,y,width:w,height:ht},g);
 const t=el('text',{x:x+w/2,y:y-6,'text-anchor':'middle','font-size':30,'font-weight':900,fill:'#e63946',stroke:'#fff','stroke-width':8,'paint-order':'stroke'},g);t.textContent='야옹!'}
svg.addEventListener('pointerdown',e=>{if(found)return;const p=pt(e),H=STAGES[si].hits;
 let k=-1,bd=1e9;H.forEach((h,j)=>{const d=Math.hypot(p.x-h.x,p.y-h.y);if(!got[j]&&d<=h.r&&d<bd){bd=d;k=j}});
 if(k>=0){const h=H[k];got[k]=true;cnt();
  el('circle',{cx:h.x,cy:h.y,r:h.r,fill:'none',stroke:'#ffd166','stroke-width':10,class:'ring'});
  el('circle',{cx:h.x,cy:h.y,r:h.r,fill:'none',stroke:'#ffb703','stroke-width':5,'pointer-events':'none'});
  if(navigator.vibrate)navigator.vibrate(60);setTimeout(()=>reveal(h),300);
  if(got.every(Boolean)){found=true;clearInterval(timer);const s=(Date.now()-t0)/1000|0;total+=s;$('msg').textContent='모두 찾았다! 🎉';
   setTimeout(()=>{const last=si===STAGES.length-1;$('otitle').textContent=last?'모든 써니를 찾았어요! 🐾':'스테이지 클리어! 🐱';
    $('otext').textContent=last?`총 기록 ${fmt(total)}`:`기록 ${fmt(s)}`;$('next').textContent=last?'처음부터':'다음 스테이지';$('overlay').classList.remove('hidden')},1800)}
  else $('msg').textContent='찾았다! 남은 써니를 계속 찾아보세요.'}
 else{const m=el('path',{d:`M${p.x-16} ${p.y-16}L${p.x+16} ${p.y+16}M${p.x+16} ${p.y-16}L${p.x-16} ${p.y+16}`,stroke:'#e63946','stroke-width':8,'stroke-linecap':'round',class:'miss'});
  setTimeout(()=>m.remove(),800);if(navigator.vibrate)navigator.vibrate(20)}});
$('hint').onclick=()=>{if(found)return;const H=STAGES[si].hits,h=H[got.indexOf(false)];t0-=10000;tick();$('msg').textContent='힌트: '+STAGES[si].tip+' (+10초)';
 const c=el('circle',{cx:h.x+(Math.random()-.5)*80,cy:h.y+(Math.random()-.5)*80,r:110,fill:'#ffd16655',stroke:'#ff9f1c','stroke-width':10,class:'pulse','pointer-events':'none'});setTimeout(()=>c.remove(),3000)};
$('next').onclick=()=>{$('overlay').classList.add('hidden');if(si===STAGES.length-1){total=0;load(0)}else load(si+1)};
load(0);
