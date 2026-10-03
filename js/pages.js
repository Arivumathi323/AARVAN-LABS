'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const groups=[...document.querySelectorAll('.nav-group details')];
 groups.forEach(group=>{
  group.addEventListener('toggle',()=>{if(group.open)groups.filter(x=>x!==group).forEach(x=>x.open=false);});
  group.addEventListener('keydown',event=>{if(event.key==='Escape'){group.open=false;group.querySelector('summary').focus();event.stopPropagation();}});
  group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))group.open=false;});
 });
 document.addEventListener('click',event=>{groups.forEach(group=>{if(!group.contains(event.target))group.open=false;});const link=event.target.closest('[data-cta]');if(link && typeof window.va==='function')window.va('event',{name:'cta_click',data:{cta:link.dataset.cta,page:location.pathname}});});
});
