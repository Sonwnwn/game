import {Player} from './player.js';
import {LEVELS} from './levels.js';
import {AudioManager} from './audio.js';
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export class Game{
 constructor(canvas,onChange,onEnd){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.onChange=onChange;this.onEnd=onEnd;this.input={left:false,right:false,jump:false};this.audio=new AudioManager();this.status='ready';this.index=0;this.total=0;try{this.best=Number(localStorage.getItem('minionBananaBest')||0)}catch{this.best=0}this.last=0;this.raf=null;this.camera=0;this.images=Array.from({length:5},(_,i)=>{const im=new Image();im.src=`assets/world${i+1}.jpg`;im.onload=()=>{if(this.status!=='running')this.draw()};return im});this.checkpoint=this.readCheckpoint();this.load(0);this.draw()}
 readCheckpoint(){try{return Math.max(0,Math.min(LEVELS.length-1,Number(localStorage.getItem('minionBananaCheckpoint')||0)||0))}catch{return 0}}
 saveCheckpoint(i){this.checkpoint=i;try{localStorage.setItem('minionBananaCheckpoint',String(i))}catch{}}
 load(i){this.index=i;this.level=structuredClone(LEVELS[i]);this.player=new Player(this.level.start.x,this.level.start.y);this.collected=0;this.camera=0;this.onChange(this)}
 start(){if(this.status==='running')return;if(this.status==='won'||this.status==='lost'){this.restart();return}this.status='running';this.last=0;this.audio.init();this.audio.musicStart();this.onChange(this);if(this.raf===null)this.raf=requestAnimationFrame(t=>this.loop(t))}
 pause(){if(this.status!=='running')return;this.status='paused';this.last=0;this.audio.musicStop();this.onChange(this)}
 restart(){if(this.raf!==null){cancelAnimationFrame(this.raf);this.raf=null}this.audio.musicStop();this.total=0;this.input.jump=false;this.saveCheckpoint(0);this.load(0);this.status='running';this.last=0;this.audio.init();this.audio.musicStart();this.onChange(this);this.raf=requestAnimationFrame(t=>this.loop(t))}
 resumeCheckpoint(){if(this.raf!==null){cancelAnimationFrame(this.raf);this.raf=null}this.audio.musicStop();this.total=0;this.input={left:false,right:false,jump:false};this.load(this.checkpoint);this.status='running';this.last=0;this.audio.init();this.audio.musicStart();this.onChange(this);this.raf=requestAnimationFrame(t=>this.loop(t))}
 end(status){this.status=status;this.last=0;this.audio.musicStop();if(status==='won')this.audio.win();else this.audio.lose();if(this.total>this.best){this.best=this.total;try{localStorage.setItem('minionBananaBest',String(this.best))}catch{}}this.onChange(this);this.onEnd(status,this)}
 loop(t){this.raf=null;if(this.status!=='running')return;const dt=this.last?Math.min((t-this.last)/1000,.033):0;this.last=t;this.update(dt);this.draw();if(this.status==='running')this.raf=requestAnimationFrame(time=>this.loop(time))}
 update(dt){const p=this.player;p.justJumped=false;p.update(dt,this.input,this.level.platforms,this.level.width);if(p.justJumped)this.audio.jump();this.camera=Math.max(0,Math.min(this.level.width-960,p.x-340));if(p.y>575){this.end('lost');return}for(const h of this.level.hazards){if(hit(p,h)){this.end('lost');return}}for(const b of this.level.bananas){if(!b.taken&&hit(p,{x:b.x-14,y:b.y-16,w:28,h:32})){b.taken=true;this.collected++;this.total+=b.gold?500:100;this.audio.banana(b.gold);this.onChange(this)}}const f=this.level.finish;if(this.collected===this.level.bananas.length&&hit(p,{x:f.x-8,y:f.y-8,w:42,h:92})){if(this.index+1<LEVELS.length){this.saveCheckpoint(this.index+1);this.load(this.index+1);this.audio.win()}else {this.saveCheckpoint(0);this.end('won')}}}
 draw(){const c=this.ctx;c.clearRect(0,0,960,540);const im=this.images[this.level.bg-1];if(im.complete&&im.naturalWidth){const scale=Math.max(960/im.width,540/im.height),w=im.width*scale,h=im.height*scale;const parallax=this.camera/(this.level.width-960||1);c.drawImage(im,-parallax*(w-960),540-h,w,h)}else{c.fillStyle='#86d4ff';c.fillRect(0,0,960,540)}c.save();c.translate(-this.camera,0);
 const themes=[
  {body:'#785034',top:'#4aab4d',shine:'#80df66',detail:'#966944'},
  {body:'#af67a7',top:'#f7a3db',shine:'#ffe4f6',detail:'#8c4e93'},
  {body:'#27304d',top:'#6674bd',shine:'#b6c7ff',detail:'#45577e'},
  {body:'#9a5d39',top:'#f4c566',shine:'#fff1ad',detail:'#d48b45'},
  {body:'#79569b',top:'#8fd2db',shine:'#d9ffff',detail:'#a581c2'}
 ];
 const theme=themes[this.index];
 for(const p of this.level.platforms){
   c.fillStyle=theme.body;c.fillRect(p.x,p.y+12,p.w,p.h);
   c.fillStyle=theme.top;c.fillRect(p.x,p.y,p.w,14);
   c.fillStyle=theme.shine;c.fillRect(p.x,p.y,p.w,5);
   if(p.floating){c.fillStyle=theme.detail;c.fillRect(p.x+10,p.y+14,p.w-20,3)}
   else for(let x=p.x+12;x<p.x+p.w-8;x+=32){c.fillStyle=theme.detail;c.fillRect(x,p.y+25,12,9)}
 }
 for(const h of this.level.hazards){c.fillStyle='#d62842';for(let x=h.x;x<h.x+h.w;x+=14){c.beginPath();c.moveTo(x,h.y+h.h);c.lineTo(x+7,h.y);c.lineTo(Math.min(x+14,h.x+h.w),h.y+h.h);c.fill()}}
 for(const b of this.level.bananas){if(b.taken)continue;c.save();c.translate(b.x,b.y);if(b.gold){c.shadowColor='#ffe500';c.shadowBlur=24;c.fillStyle='#fff4a0';c.beginPath();c.arc(0,0,25,0,Math.PI*2);c.fill();c.fillStyle='#d98b00';c.font='bold 15px sans-serif';c.fillText('★',-7,-22)}c.rotate(-.45);c.strokeStyle=b.gold?'#ae7000':'#e9a500';c.lineWidth=12;c.lineCap='round';c.beginPath();c.arc(0,-2,14,.25,2.55);c.stroke();c.strokeStyle=b.gold?'#ffd700':'#ffec56';c.lineWidth=8;c.beginPath();c.arc(0,-2,14,.25,2.55);c.stroke();c.restore()}
 const f=this.level.finish;c.fillStyle='#303a52';c.fillRect(f.x+18,f.y-5,5,90);for(let r=0;r<4;r++)for(let k=0;k<4;k++){c.fillStyle=(r+k)%2?'#1b3349':'white';c.fillRect(f.x+23+k*10,f.y+r*10,10,10)}this.player.draw(c);c.restore();c.fillStyle=this.index===2?'#ffffff':'#132c47';c.shadowColor=this.index===2?'#000b':'transparent';c.shadowBlur=this.index===2?5:0;c.font='700 20px Fredoka,sans-serif';c.fillText(`${this.level.name} · ${this.index+1}/${LEVELS.length}`,20,30);c.font='600 17px Fredoka,sans-serif';c.fillText(`🍌 ${this.collected}/${this.level.bananas.length}  ·  ${this.total} очков`,20,55);c.shadowBlur=0;
 const remaining=this.level.bananas.filter(b=>!b.taken);
 if(remaining.length){
  const target=remaining.reduce((best,b)=>Math.abs(b.x-(this.player.x+this.player.w/2))<Math.abs(best.x-(this.player.x+this.player.w/2))?b:best,remaining[0]);
  const distance=Math.round(Math.abs(target.x-(this.player.x+this.player.w/2)));
  const arrow=target.x>this.player.x+this.player.w/2+20?'→':target.x<this.player.x+this.player.w/2-20?'←':'↑';
  c.font='700 17px Fredoka,sans-serif';c.textAlign='right';c.fillStyle=this.index===2?'white':'#132c47';
  c.fillText(`${target.gold?'⭐ Золотой банан':'🍌 Следующий банан'} ${arrow} ${distance} м`,940,30);c.textAlign='left';
 }
 if(this.collected===this.level.bananas.length){c.fillStyle=this.index===2?'#ffffff':'#164f27';c.fillText('Все бананы собраны! К флагу →',610,30)}}
}
