import {Game} from './game.js';
const $=id=>document.getElementById(id),overlay=$('overlay'),title=$('messageTitle'),message=$('messageText'),action=$('overlayAction'),continueButton=$('continueLevel');
const game=new Game($('canvas'),g=>{$('score').textContent=`${g.collected}/${g.level.bananas.length}`;$('best').textContent=g.best;$('level').textContent=`${g.index+1}/5`},(status,g)=>{
 overlay.classList.remove('hidden');
 if(status==='won'){title.textContent='ПОБЕДА! 🎉';message.textContent=`Ты прошла все 5 миров! Очки: ${g.total}.`;action.textContent='Начать с первого';continueButton.hidden=true}
 else{title.textContent='Ой! Миньон проиграл!';message.textContent=g.checkpoint>0?`Прогресс сохранён: открыт уровень ${g.checkpoint+1}. С какого уровня начнём?`:'Попробуй снова! Первый уровень ждёт.';action.textContent='С первого уровня';continueButton.hidden=g.checkpoint===0;continueButton.textContent=`Продолжить с уровня ${g.checkpoint+1}`}
});
function hide(){overlay.classList.add('hidden')}
function start(){hide();if(game.status==='lost'||game.status==='won')game.restart();else game.start()}
function restart(){hide();game.restart()}
function pause(){if(game.status!=='running')return;game.pause();title.textContent='Пауза ⏸';message.textContent='Миньон ждёт тебя!';action.textContent='Продолжить';continueButton.hidden=true;overlay.classList.remove('hidden')}
$('start').addEventListener('click',start);$('pause').addEventListener('click',pause);$('restart').addEventListener('click',restart);
action.addEventListener('click',()=>{if(game.status==='lost'||game.status==='won')restart();else start()});
continueButton.addEventListener('click',()=>{hide();game.resumeCheckpoint()});
const keys={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump'};
window.addEventListener('keydown',e=>{const key=keys[e.code];if(key){e.preventDefault();game.input[key]=true}});
window.addEventListener('keyup',e=>{const key=keys[e.code];if(key){e.preventDefault();game.input[key]=false}});
window.addEventListener('blur',()=>{game.input.left=game.input.right=game.input.jump=false;pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
for(const button of document.querySelectorAll('[data-control]')){const control=button.dataset.control;const down=e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);game.input[control]=true};const up=e=>{e.preventDefault();game.input[control]=false};button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up)}
$('sound').addEventListener('click',()=>{const on=game.audio.toggle();$('sound').textContent=on?'🔊 Звук включён':'🔇 Звук выключен'});
if(game.checkpoint>0){title.textContent='С возвращением! 🍌';message.textContent=`У тебя открыт уровень ${game.checkpoint+1}. Начать заново или продолжить?`;action.textContent='С первого уровня';continueButton.hidden=false;continueButton.textContent=`Продолжить с уровня ${game.checkpoint+1}`}
