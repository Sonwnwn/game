// Пять отдельных карт: разные ширины, высоты, расстановка бананов и шипов.
// Максимальный горизонтальный прыжок ~200 px; промежутки между платформами <= 105 px.
const maps = [
 {name:'Пиксельная долина',bg:1,ys:[490,450,405,455,415,370,425,470,420,375,430,480,435,490],ws:[250,175,160,185,160,165,180,155,165,175,160,165,180,250],gold:8,spikes:[4,9]},
 {name:'Радужные холмы',bg:2,ys:[490,435,390,350,410,460,410,360,320,390,440,390,350,415,490],ws:[250,165,155,160,170,180,160,150,155,165,160,170,155,170,250],gold:7,spikes:[3,6,11]},
 {name:'Ночной город',bg:3,ys:[490,455,420,380,440,400,350,410,460,405,365,420,380,445,490],ws:[250,160,150,150,175,150,155,165,175,160,145,165,150,170,250],gold:10,spikes:[2,5,8,12]},
 {name:'Мир мемов',bg:4,ys:[490,440,385,430,370,320,390,450,400,345,410,355,420,370,435,490],ws:[250,155,145,155,150,145,160,165,150,145,150,145,160,150,165,250],gold:5,spikes:[3,7,10,13]},
 {name:'Банановый финал',bg:5,ys:[490,440,390,340,410,465,405,350,305,370,430,380,325,390,450,395,345,420,490],ws:[250,160,145,145,160,170,145,145,145,155,165,145,145,155,170,150,145,160,250],gold:12,spikes:[2,4,7,10,13,16]}
];
export const LEVELS=maps.map((m,level)=>{
 let x=0;
 const platforms=m.ys.map((y,i)=>{const p={x,y,w:m.ws[i],h:540-y};x+=m.ws[i]+(i===m.ys.length-1?0:48+((i*13+level*17)%4)*12);return p});
 const bananas=[];
 platforms.slice(1,-1).forEach((p,i)=>{
   // Уровни отличаются количеством бананов и их позициями.
   if((i+level)%4!==0)bananas.push({x:p.x+p.w*(.28+((i+level)%3)*.20),y:p.y-(34+(i%3)*12),gold:false,taken:false});
   // На каждой платформе не более одного обычного банана.
 });
 // Парящие платформы расположены на 68–84 px выше опоры.
 // Высота прыжка героя около 112 px, поэтому на них реально попасть.
 if(level>0){
   const indices=level===1?[2,5,8,11]:level===2?[1,4,7,10,13]:level===3?[2,4,7,10,13]:[2,5,8,11,14,16];
   for(let j=0;j<indices.length;j++){
     const base=platforms[indices[j]];
     const raised={x:base.x+Math.round(base.w*.16),y:base.y-(68+((j+level)%2)*16),w:Math.min(112,base.w-22),h:17,floating:true};
     platforms.push(raised);
     // Бананы висят отдельно, один над каждой второй парящей платформой.
     if(j%2===0)bananas.push({x:raised.x+raised.w*.5,y:raised.y-33,gold:false,taken:false});
   }
 }
 const gp=level===0?platforms[m.gold]:platforms.find(p=>p.floating&&p.x>platforms[m.gold].x-180)||platforms.find(p=>p.floating);
 // Золотой банан отдельно от обычных: забраться к нему сложнее.
 bananas.push({x:gp.x+gp.w*.53,y:gp.y-(level===0?112:42),gold:true,taken:false});
 const hazards=m.spikes.map(i=>{const p=platforms[i];return{x:p.x+p.w-30,y:p.y-17,w:25,h:17}});
 // Шипы в пропастях, чтобы падение тоже было опасным.
 platforms.slice(0,-1).forEach((p,i)=>{if(i%3===level%3){const next=platforms[i+1];hazards.push({x:p.x+p.w+7,y:519,w:Math.max(10,next.x-p.x-p.w-14),h:21})}});
 const last=platforms[m.ys.length-1];
 return {name:m.name,bg:m.bg,width:last.x+last.w,start:{x:35,y:420},platforms,bananas,hazards,finish:{x:last.x+last.w-85,y:last.y-85}};
});
