import { services, learn } from '../content/site.mjs';
const interests=new Set([...services,...learn].map(x=>x.slug));
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST to send an enquiry.'});}
 const type=req.headers['content-type'] || '';
 if(!type.includes('application/json')&&!type.includes('application/x-www-form-urlencoded')) return res.status(415).json({error:'Unsupported request format.'});
 let data=req.body;
 try {if(typeof data==='string') data=type.includes('application/json')?JSON.parse(data):Object.fromEntries(new URLSearchParams(data));}catch{return res.status(400).json({error:'Invalid request.'});}
 if(!data || typeof data!=='object' || Array.isArray(data))return res.status(400).json({error:'Invalid request.'});
 if(JSON.stringify(data).length>12000)return res.status(413).json({error:'Message is too large.'});
 if(typeof data.website==='string' && data.website.trim())return res.status(200).json({ok:true});
 const text=(key,max)=>typeof data[key]==='string'&&data[key].length<=max?data[key].trim():'';
 const name=text('name',120),email=text('email',254),phone=text('phone',30),interest=text('interest',80),budget=text('budget',60),message=text('message',5000);
 if(!name || /[\r\n]/.test(name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+\d()\s.-]{7,30}$/.test(phone) || !interests.has(interest) || message.length<10) return res.status(400).json({error:'Check your name, email, phone, interest and message (at least 10 characters).'});
 if(!process.env.RESEND_API_KEY||!process.env.CONTACT_FROM_EMAIL||!process.env.CONTACT_TO_EMAIL)return res.status(503).json({error:'Email delivery is not configured yet. Please use a social link in the footer to reach Aarvan Labs.'});
 try {
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:[process.env.CONTACT_TO_EMAIL],reply_to:email,subject:`Website enquiry: ${interest}`,text:`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\nBudget: ${budget||'Not specified'}\n\n${message}`}),signal:AbortSignal.timeout(12000)});
  const result=await response.json();
  if(!response.ok||!result.id)throw new Error('Delivery rejected');
  return res.status(200).json({ok:true});
 }catch{return res.status(502).json({error:'Your message could not be sent. Please try again shortly or contact us through a social link.'});}
}
