(()=>{
  const loader=document.getElementById('siteLoader');
  const progress=document.getElementById('siteLoaderProgress');
  const startedAt=performance.now();
  let amount=0,ready=false,dismissed=false;
  document.body.setAttribute('aria-busy','true');
  const hideLoader=()=>{
    if(!ready||dismissed||performance.now()-startedAt<700)return;
    dismissed=true;
    clearInterval(progressTimer);
    progress.style.width='100%';
    setTimeout(()=>{
      loader.classList.add('is-leaving');
      document.body.removeAttribute('aria-busy');
      setTimeout(()=>{loader.hidden=true},500);
    },180);
  };
  const progressTimer=setInterval(()=>{
    if(amount<90){
      amount=Math.min(90,amount+Math.max(.5,(90-amount)*.055));
      progress.style.width=`${amount}%`;
    }
    hideLoader();
  },100);
  const markReady=()=>{ready=true;hideLoader()};
  window.addEventListener('load',markReady,{once:true});
  setTimeout(markReady,5500);
  if(document.readyState==='complete')markReady();
})();
