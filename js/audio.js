// Пользовательские аудиофайлы: короткий голос на прыжок, песня тихо и по кругу.
export class AudioManager {
 constructor(){this.ctx=null;this.enabled=true;this.music=new Audio('assets/music.mp3');this.music.loop=true;this.music.volume=.11;this.jumpSound=new Audio('assets/jump.mp3');this.jumpSound.volume=.8}
 init(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(A)this.ctx=new A()}this.ctx?.resume()}
 tone(freq,duration=.12,type='sine',volume=.055,when=0){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime+when,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+duration+.01)}
 jump(){if(!this.enabled)return;this.jumpSound.pause();this.jumpSound.currentTime=0;this.jumpSound.play().catch(()=>{})}
 banana(gold){this.tone(gold?900:680,.13,'sine',.08);this.tone(gold?1350:980,.2,'sine',.06,.1)}
 lose(){this.tone(290,.2,'sawtooth',.04);this.tone(180,.3,'triangle',.06,.2)}
 win(){[523,659,784,1047].forEach((n,i)=>this.tone(n,.23,'triangle',.06,i*.13))}
 musicStart(){if(this.enabled)this.music.play().catch(()=>{})}
 musicStop(){this.music.pause();this.jumpSound.pause()}
 toggle(){this.enabled=!this.enabled;if(!this.enabled)this.musicStop();else this.musicStart();return this.enabled}
}
