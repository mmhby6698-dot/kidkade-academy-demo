(() => {
  const fa = n => Number(n).toLocaleString('fa-IR');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // robot eyes follow pointer
  const eyes = document.getElementById('eyes'), robot = document.getElementById('robot');
  if (!reduce) addEventListener('pointermove', e => { const r = robot.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height*.4), d = Math.hypot(dx,dy) || 1;
    eyes.style.transform = `translate(${dx/d*6}px,${dy/d*5}px)`; }, {passive:true});
  // confetti
  const conf = document.getElementById('confetti');
  const boom = () => { if (reduce) return; const cols = ['#ff7eb6','#ffd23f','#2ec4b6','#7b5cff','#ff8c42'];
    for (let i=0;i<70;i++){ const c = document.createElement('i'); c.style.left = Math.random()*100+'vw'; c.style.background = cols[i%5];
      c.style.animationDelay = Math.random()*.5+'s'; conf.appendChild(c); setTimeout(()=>c.remove(),2600);} };
  // mini game
  const N=5, start={r:4,c:0}, star={r:0,c:4}, rocks=new Set(['3,1','1,1','2,3','4,3','0,2']);
  const board = document.getElementById('board');
  for (let r=0;r<N;r++) for (let c=0;c<N;c++){ const d=document.createElement('div'); d.className='cell'+(rocks.has(r+','+c)?' rock':'');
    d.textContent = rocks.has(r+','+c)?'🪨':(r===star.r&&c===star.c?'⭐':''); board.appendChild(d); }
  const bot = document.createElement('div'); bot.className='bot'; bot.textContent='🤖'; board.appendChild(bot);
  let pos={...start}, prog=[], running=false;
  const place = () => { const cell = board.children[pos.r*N+pos.c]; bot.style.width=cell.offsetWidth+'px'; bot.style.height=cell.offsetHeight+'px';
    bot.style.transform = `translate(${cell.offsetLeft}px,${cell.offsetTop}px)`; };
  addEventListener('resize', place); requestAnimationFrame(place);
  const icons={up:'⬆️',down:'⬇️',left:'⬅️',right:'➡️'}, mv={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]};
  const progEl=document.getElementById('prog'), msg=document.getElementById('gameMsg');
  const draw = () => progEl.innerHTML = prog.map(p=>`<li>${icons[p]}</li>`).join('');
  document.querySelector('.cmds').addEventListener('click', e => { const b=e.target.closest('button'); if(!b||running) return;
    if (prog.length>=14){ msg.textContent='حداکثر ۱۴ دستور! اول اجراش کن.'; return; } prog.push(b.dataset.cmd); draw(); msg.textContent=''; });
  document.getElementById('clear').addEventListener('click', () => { if(running) return; prog=[]; pos={...start}; draw(); place(); msg.textContent=''; });
  const wait = ms => new Promise(r=>setTimeout(r, reduce?60:ms));
  document.getElementById('run').addEventListener('click', async () => {
    if (running) return; if (!prog.length){ msg.textContent='اول چند تا دستور اضافه کن 👆'; return; }
    running=true; pos={...start}; place(); await wait(300);
    for (let i=0;i<prog.length;i++){ [...progEl.children].forEach((li,j)=>li.classList.toggle('now',i===j));
      const [dr,dc]=mv[prog[i]], nr=pos.r+dr, nc=pos.c+dc;
      if (nr<0||nc<0||nr>=N||nc>=N||rocks.has(nr+','+nc)){ bot.classList.remove('bonk'); void bot.offsetWidth; bot.classList.add('bonk');
        msg.textContent = `آخ! دستور ${fa(i+1)} ربات رو به ${rocks.has(nr+','+nc)?'سنگ':'دیوار'} زد. یه باگ پیدا کردی؛ درستش کن! 🐞`; running=false; return; }
      pos={r:nr,c:nc}; place(); await wait(420);
      if (pos.r===star.r&&pos.c===star.c){ msg.textContent=`آفرین! با ${fa(i+1)} دستور به ستاره رسیدی. تو الان یه برنامه‌نویسی! 🎉`; boom(); running=false; return; } }
    msg.textContent='ربات هنوز به ستاره نرسیده؛ چند تا دستور دیگه اضافه کن.'; running=false; });
  // quiz
  const Q=[
    {q:'بچه‌ی شما چند سالشه؟',o:[['۷ تا ۹ سال',{a:3}],['۱۰ تا ۱۲ سال',{b:3}],['۱۳ تا ۱۵ سال',{c:3}]]},
    {q:'بیشتر وقتش رو با چی می‌گذرونه؟',o:[['نقاشی و قصه',{a:2}],['بازی‌های ویدیویی',{b:2}],['کنجکاوی درباره‌ی اینکه چیزها چطور کار می‌کنن',{c:2}]]},
    {q:'تایپ کردن با کیبورد براش راحته؟',o:[['نه هنوز',{a:2}],['یه کمی',{b:1}],['آره، راحت',{c:1}]]}];
  const R={a:['🎨','کدنویسی بدون کیبورد','با بلوک‌های رنگی شروع کنه؛ هم سرگرمه هم پایه‌ی منطق رو می‌سازه.'],
    b:['🕹️','بازی‌ساز کوچولو','وقتشه بازی‌هایی که دوست داره رو خودش بسازه!'],
    c:['🐍','پایتون و بازی‌سازی','آماده‌ی اولین زبان برنامه‌نویسی واقعیه.']};
  let qi=0, score={a:0,b:0,c:0};
  const qStep=document.getElementById('qStep'), qText=document.getElementById('qText'), qOpts=document.getElementById('qOpts'), qBar=document.getElementById('qBar');
  const showQ = () => { qBar.style.width=(qi/Q.length*100)+'%';
    if (qi>=Q.length){ const k=Object.keys(score).sort((x,y)=>score[y]-score[x])[0], [ic,t,d]=R[k];
      qStep.textContent='نتیجه'; qText.textContent=''; qOpts.innerHTML=`<div class="result"><div class="big">${ic}</div><h3>${t}</h3><p>${d}</p><p style="margin-top:1rem"><a class="btn btn-pop" href="#signup">رزرو جلسه رایگان</a> <button type="button" class="btn btn-soft" id="again">دوباره</button></p></div>`;
      document.getElementById('again').onclick=()=>{qi=0;score={a:0,b:0,c:0};showQ();}; return; }
    qStep.textContent=`سؤال ${fa(qi+1)} از ${fa(Q.length)}`; qText.textContent=Q[qi].q;
    qOpts.innerHTML=Q[qi].o.map(([t],i)=>`<button type="button" data-i="${i}">${t}</button>`).join(''); };
  qOpts.addEventListener('click', e => { const b=e.target.closest('button[data-i]'); if(!b) return;
    const w=Q[qi].o[b.dataset.i][1]; for(const k in w) score[k]+=w[k]; qi++; showQ(); });
  showQ();
  // pricing toggle
  const tg=document.querySelector('.toggle');
  tg.addEventListener('click', e => { const b=e.target.closest('button'); if(!b) return; const t=b.dataset.mode==='t';
    tg.classList.toggle('t',t); tg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-checked', String(x===b)));
    document.querySelectorAll('.price').forEach(p => { const el=p.querySelector('b'), m=+el.dataset.m;
      el.textContent = fa(t ? Math.round(m*3*.85/10000)*10000 : m); el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
      p.querySelector('.per').textContent = t ? 'تومان / ترم (۳ ماه)' : 'تومان / ماه'; }); });
  // signup form (front-end only)
  const f=document.getElementById('sForm'), err=document.getElementById('sErr'), ok=document.getElementById('sOk');
  f.addEventListener('submit', e => { e.preventDefault(); const n=f.pName, p=f.pPhone, a=f.kAge; [n,p,a].forEach(x=>x.removeAttribute('aria-invalid'));
    const d=p.value.replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x));
    if (n.value.trim().length<2){ err.textContent='نام ولی رو بنویسید.'; n.setAttribute('aria-invalid','true'); n.focus(); return; }
    if (!/^09\d{9}$/.test(d)){ err.textContent='شماره موبایل باید ۱۱ رقم و با ۰۹ شروع بشه.'; p.setAttribute('aria-invalid','true'); p.focus(); return; }
    if (!a.value){ err.textContent='سن کودک رو انتخاب کنید.'; a.setAttribute('aria-invalid','true'); a.focus(); return; }
    err.textContent=''; ok.textContent=`ممنون ${n.value.trim()}! به‌زودی برای هماهنگی تماس می‌گیریم. (نمایشی؛ اطلاعاتی ارسال نشد)`; boom(); f.reset(); });
})();
