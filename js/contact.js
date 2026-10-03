'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('contact-form'); if(!form)return;
 const interest=new URLSearchParams(location.search).get('interest');
 if(interest && [...form.elements.interest.options].some(x=>x.value===interest))form.elements.interest.value=interest;
 const status=document.getElementById('form-status');
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const button=form.querySelector('[type="submit"]');button.disabled=true;button.textContent='Sending…';form.setAttribute('aria-busy','true');status.textContent='Sending your enquiry…';
  try {
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(18000)});
   const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'Message could not be sent. Please try again.');
   status.textContent='Thank you. Your enquiry has been sent to Aarvan Labs.';form.reset();if(interest)form.elements.interest.value=interest;
  }catch(error){status.textContent=error.name==='TimeoutError'?'The request timed out. Please try again shortly.':error.message||'Unable to connect. Please try again.';}
  finally{button.disabled=false;button.textContent='Send Message';form.removeAttribute('aria-busy');}
 });
});
