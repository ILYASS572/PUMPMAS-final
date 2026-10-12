const A='https://pump.fun/coin/6j8da9yqUVHJtpjdf55sjVyKCo1W8Tvd57g2xynBpump', target=new Date('2026-12-25T00:00:00');
function pad(n){return String(n).padStart(2,'0')}
const countdownUnits=[['Days','days'],['Hours','hours'],['Minutes','minutes'],['Seconds','seconds']];
const heroCountdown=document.getElementById('heroCountdown');
const unitEls={};
heroCountdown.innerHTML=countdownUnits.map(([label,key])=>`<div class="snow-cap relative flex flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-b from-card to-background/80 px-2 pb-3 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] sm:px-4"><span data-countdown-key="${key}" class="font-display text-4xl leading-none tabular-nums text-foreground text-glow-gold sm:text-6xl"></span><span class="mt-2 text-[9px] font-extrabold uppercase tracking-[.22em] text-[#a6b0c8] sm:text-[10px]">${label}</span></div>`).join('');
countdownUnits.forEach(([,key])=>{unitEls[key]=heroCountdown.querySelector(`[data-countdown-key="${key}"]`)});
let lastValues={days:null,hours:null,minutes:null,seconds:null};
function updateCountdownUnit(key,value){
  const next=pad(value);
  if(lastValues[key]===next) return;
  const el=unitEls[key];
  el.classList.remove('digit-tick');
  void el.offsetWidth;
  el.textContent=next;
  el.classList.add('digit-tick');
  lastValues[key]=next;
}
function countdown(){
  let ms=Math.max(0,target-Date.now()),d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);
  updateCountdownUnit('days',d);
  updateCountdownUnit('hours',h);
  updateCountdownUnit('minutes',m);
  updateCountdownUnit('seconds',s);
  document.querySelector('#navCountdown span').textContent=`${pad(d)}D : ${pad(h)}H : ${pad(m)}M : ${pad(s)}S`;
}
countdown();setInterval(countdown,1000);

const items=['$PUMPMAS','The official OG Christmas coin','Front run the narrative','Ho ho hodl'];let g=[...items,...items].map((x,i)=>`<span class="flex items-center gap-8"><span class="${i%4===0?'font-display text-2xl tracking-wider text-accent':'text-sm font-extrabold uppercase tracking-[.2em] text-white'}">${x}</span><span class="text-white text-xl">❄</span></span>`).join('');document.getElementById('marquee').innerHTML=`<div class="flex shrink-0 items-center gap-8 pr-8">${g}</div><div class="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">${g}</div>`;

document.querySelectorAll('.faq-button').forEach(b=>b.addEventListener('click',()=>{let f=b.parentElement,open=f.classList.contains('open');document.querySelectorAll('.faq').forEach(x=>x.classList.remove('open'));if(!open)f.classList.add('open');b.setAttribute('aria-expanded',String(!open))}));
document.getElementById('menuBtn').addEventListener('click',()=>{let m=document.getElementById('mobileMenu'),btn=document.getElementById('menuBtn'),open=!m.classList.contains('hidden');m.classList.toggle('hidden',open);btn.setAttribute('aria-expanded',String(!open));btn.textContent=open?'☰':'×'});
document.querySelectorAll('.mobile-link').forEach(a=>a.addEventListener('click',()=>{document.getElementById('mobileMenu').classList.add('hidden');document.getElementById('menuBtn').textContent='☰'}));
document.getElementById('copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('6j8da9yqUVHJtpjdf55sjVyKCo1W8Tvd57g2xynBpump');document.getElementById('copyBtn').textContent='Copied';setTimeout(()=>document.getElementById('copyBtn').textContent='Copy',1500)}catch(e){}});

const backgroundMusic=document.getElementById('backgroundMusic');
const musicToggle=document.getElementById('musicToggle');
const musicToggleLabel=document.getElementById('musicToggleLabel');
const musicTargetGain=Math.pow(10,-6/20);
const musicFadeSeconds=2;
let musicContext,musicGain,musicSource,musicFadeOutScheduled=false,musicAutoplayBlocked=false,musicAutoplayPending=true,musicGesturePending=false;
function updateMusicButton(playing,label){
  musicToggle.classList.remove('hidden');
  musicToggle.classList.add('inline-flex');
  musicToggle.setAttribute('aria-pressed',String(playing));
  musicToggle.setAttribute('aria-label',playing?'Pause Christmas music':'Play Christmas music');
  musicToggleLabel.textContent=label;
}
function setupMusicAudio(){
  if(musicContext)return;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)throw new Error('Web Audio is not supported in this browser.');
  musicContext=new AudioContextClass();
  musicGain=musicContext.createGain();
  musicGain.gain.value=0;
  musicSource=musicContext.createMediaElementSource(backgroundMusic);
  musicSource.connect(musicGain);
  musicGain.connect(musicContext.destination);
}
function fadeMusicIn(){
  const now=musicContext.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(0,now);
  musicGain.gain.linearRampToValueAtTime(musicTargetGain,now+musicFadeSeconds);
}
async function startMusic(fromBeginning=false){
  setupMusicAudio();
  if(fromBeginning)backgroundMusic.currentTime=0;
  const resume=musicContext.state==='suspended'?musicContext.resume():Promise.resolve();
  const playback=backgroundMusic.play();
  await Promise.all([resume,playback]);
  musicAutoplayBlocked=false;
  musicAutoplayPending=false;
  musicFadeOutScheduled=false;
  fadeMusicIn();
  updateMusicButton(true,'Pause music');
}
function retryMusicOnInteraction(event){
  if((!musicAutoplayBlocked&&!musicAutoplayPending)||musicToggle.contains(event.target)||musicGesturePending)return;
  musicGesturePending=true;
  startMusic(true).catch(error=>{
    musicAutoplayBlocked=true;
    console.error('Christmas music could not be played after user interaction.',error);
  }).finally(()=>{musicGesturePending=false});
}
document.addEventListener('pointerdown',retryMusicOnInteraction);
document.addEventListener('keydown',retryMusicOnInteraction);
startMusic(true).catch(error=>{
  musicAutoplayPending=false;
  if(backgroundMusic.paused){
    musicAutoplayBlocked=true;
    if(error.name!=='NotAllowedError')console.error('Christmas music could not start automatically.',error);
  }
});
musicToggle.addEventListener('click',async()=>{
  if(!backgroundMusic.paused){
    backgroundMusic.pause();
    musicGain.gain.cancelScheduledValues(musicContext.currentTime);
    musicGain.gain.setValueAtTime(0,musicContext.currentTime);
    updateMusicButton(false,'Play music');
    return;
  }
  try{await startMusic(true)}
  catch(error){
    console.error('Christmas music could not be played.',error);
  }
});
backgroundMusic.addEventListener('timeupdate',()=>{
  if(backgroundMusic.paused||musicFadeOutScheduled||!Number.isFinite(backgroundMusic.duration))return;
  const remaining=backgroundMusic.duration-backgroundMusic.currentTime;
  if(remaining>musicFadeSeconds)return;
  const now=musicContext.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(musicGain.gain.value,now);
  musicGain.gain.linearRampToValueAtTime(0,now+Math.max(remaining,.05));
  musicFadeOutScheduled=true;
});
backgroundMusic.addEventListener('ended',()=>{
  backgroundMusic.currentTime=0;
  startMusic().catch(error=>{
    console.error('Christmas music could not restart after looping.',error);
  });
});
backgroundMusic.addEventListener('error',()=>{
  console.error('Christmas music file failed to load.',backgroundMusic.error);
  musicToggle.disabled=true;
  if(!musicToggle.classList.contains('hidden'))musicToggleLabel.textContent='Music unavailable';
});

const revs=document.querySelectorAll('.reveal');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});revs.forEach(x=>io.observe(x));

(()=>{
const colors=['#e23a3a','#f6c453','#3fb97a','#fff1d0'];
const holidayLights=document.getElementById('holidayLights');
const ornaments=document.getElementById('heroOrnaments');
const variation=seed=>{
  const value=Math.sin((seed+1)*127.1+31.7)*43758.5453;
  return value-Math.floor(value);
};
const renderHolidayLights=()=>{
  const width=innerWidth,count=Math.max(18,Math.round(width/46)),controlY=34;
  let bulbs='',previousColor=-1;
  for(let j=1;j<=count;j++){
    const seed=j+101,t=(j+(variation(seed+41)-.5)*.24)/(count+1),u=1-t;
    const x=2*u*t*(width/2)+t*t*width;
    const y=2*u*t*controlY;
    let colorIndex=[3,3,3,3,1,1,2,0][Math.floor(variation(seed+7)*8)];
    if(colorIndex===previousColor)colorIndex=[0,1,2,3].filter(index=>index!==previousColor)[Math.floor(variation(seed+29)*3)];
    previousColor=colorIndex;
    const color=colors[colorIndex];
    const bulbWidth=8+variation(seed+13)*3,bulbHeight=11+variation(seed+19)*4;
    const delay=variation(seed+31)*-3.4;
    const duration=2.6+variation(seed+37)*2.1;
    bulbs+=`<span class="holiday-light-bulb" style="--bulb-x:${x.toFixed(1)}px;--bulb-y:${(y+7).toFixed(1)}px;--bulb-width:${bulbWidth.toFixed(1)}px;--bulb-height:${bulbHeight.toFixed(1)}px;--bulb-color:${color};--twinkle-delay:${delay.toFixed(2)}s;--twinkle-duration:${duration.toFixed(2)}s"></span>`;
  }
  holidayLights.innerHTML=`<svg aria-hidden="true" class="holiday-lights-wire" viewBox="0 0 ${width} 48" preserveAspectRatio="none"><path d="M0 1Q${(width/2).toFixed(1)} ${controlY} ${width} 1" fill="none" stroke="#27344d" stroke-width="1.6"/></svg>${bulbs}`;
};
const ornament=(id,left,length,radius,bright,mid,dark,pattern,delay)=>{
  const height=length+13+radius*2,cy=length+9+radius;
  let detail='';
  if(pattern==='stripe'){
    detail=`<clipPath id="${id}-clip"><circle cx="30" cy="${cy}" r="${radius}"/></clipPath><g clip-path="url(#${id}-clip)" opacity=".5">${[0,1,2,3,4,5,6].map(i=>`<path d="M${-30+i*14} ${height}L${10+i*14} ${length}" stroke="#fff3d6" stroke-width="5"/>`).join('')}</g>`;
  }else if(pattern==='dots'){
    for(let i=0;i<26;i++){
      const angle=Math.random()*Math.PI*2,distance=Math.sqrt(Math.random())*(radius-3);
      detail+=`<circle cx="${(30+Math.cos(angle)*distance).toFixed(1)}" cy="${(cy+Math.sin(angle)*distance).toFixed(1)}" r="${(.5+Math.random()*1.1).toFixed(1)}" fill="#fff6d8" opacity=".75"/>`;
    }
  }
  return `<div class="scene-ornament" style="left:${left};animation-delay:${delay}s"><svg width="60" height="${height}" viewBox="0 0 60 ${height}"><defs><radialGradient id="${id}-gradient" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${bright}"/><stop offset=".5" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs><line x1="30" y1="0" x2="30" y2="${length}" stroke="#c9a85a" stroke-opacity=".65"/><rect x="25" y="${length}" width="10" height="9" rx="2" fill="#f6c453"/><circle cx="30" cy="${cy}" r="${radius}" fill="url(#${id}-gradient)"/>${detail}<ellipse cx="${30-radius*.38}" cy="${cy-radius*.42}" rx="${radius*.2}" ry="${radius*.12}" transform="rotate(-35 ${30-radius*.38} ${cy-radius*.42})" fill="#fff" opacity=".6"/></svg></div>`;
};
ornaments.innerHTML=ornament('hero-orn-a','5%',58,23,'#ff8d9a','#d6334a','#6e1226','stripe',0)+ornament('hero-orn-b','11%',135,27,'#fff1b8','#f6c453','#9a6a14','plain',-1.8)+ornament('hero-orn-c','17%',72,19,'#a6f0c8','#3fb97a','#10523a','dots',-3.2)+ornament('hero-orn-d','93%',92,23,'#ff8d9a','#d6334a','#6e1226','plain',-2.4)+ornament('hero-orn-e','87%',44,18,'#fff1b8','#f6c453','#9a6a14','dots',-4);
renderHolidayLights();
let resizeTimer;
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderHolidayLights,150)});
})();

const c=document.getElementById('snow'),ctx=c.getContext('2d');let W,H,flakes=[],shootingStars=[],nextShootingStar=0;function resize(){W=innerWidth;H=innerHeight;let dpr=Math.min(devicePixelRatio||1,2);c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);flakes=Array.from({length:Math.min(80,Math.round(W*H/22000))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.6+.6,s:Math.random()*.8+.35,d:Math.random()*.6+.2,p:Math.random()*Math.PI*2,a:Math.random()*.6+.3}))}function snow(){const now=performance.now();ctx.clearRect(0,0,W,H);for(const f of flakes){f.p+=.01;f.y+=f.s*(f.r*.6);f.x+=Math.sin(f.p)*f.d;if(f.y>H+10){f.y=-10;f.x=Math.random()*W}if(f.x>W+10)f.x=-10;if(f.x<-10)f.x=W+10;ctx.beginPath();ctx.fillStyle=`rgba(255,255,255,${f.a})`;ctx.shadowColor='rgba(255,255,255,.8)';ctx.shadowBlur=f.r*2;ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill()}if(now>=nextShootingStar){shootingStars.push({x:W*(.35+Math.random()*.7),y:H*Math.random()*.42,vx:-7-Math.random()*3,vy:3+Math.random()*2,age:0,life:32});nextShootingStar=now+5000+Math.random()*6500}shootingStars=shootingStars.filter(star=>star.age<star.life);for(const star of shootingStars){star.x+=star.vx;star.y+=star.vy;star.age++;const fade=Math.sin(Math.PI*star.age/star.life);const tail=ctx.createLinearGradient(star.x,star.y,star.x-star.vx*9,star.y-star.vy*9);tail.addColorStop(0,`rgba(255,248,224,${fade})`);tail.addColorStop(1,'rgba(255,248,224,0)');ctx.beginPath();ctx.strokeStyle=tail;ctx.lineWidth=2;ctx.shadowColor='rgba(246,196,83,.9)';ctx.shadowBlur=10;ctx.moveTo(star.x,star.y);ctx.lineTo(star.x-star.vx*9,star.y-star.vy*9);ctx.stroke();ctx.beginPath();ctx.fillStyle=`rgba(255,255,255,${fade})`;ctx.arc(star.x,star.y,1.8,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0;requestAnimationFrame(snow)}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){resize();nextShootingStar=performance.now()+2500+Math.random()*3500;snow();addEventListener('resize',resize)}
