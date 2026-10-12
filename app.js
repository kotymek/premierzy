const DAY = 86400000;
const number = new Intl.NumberFormat('pl-PL');
const eras = {ii:'II Rzeczpospolita',exile:'Na uchodźstwie',prl:'Polska Ludowa',iii:'III Rzeczpospolita'};
function warsawDate(now=new Date()) {const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);return ['year','month','day'].map(k=>p.find(v=>v.type===k).value).join('-');}
function daysBetween(start,end){return Math.round((Date.parse(end+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/DAY);}
function dateLabel(date){return date?new Intl.DateTimeFormat('pl-PL',{timeZone:'UTC',day:'numeric',month:'2-digit',year:'numeric'}).format(new Date(date+'T00:00:00Z')):'dziś';}
function segments(term,today){if(term.name==='Józef Cyrankiewicz'&&term.start==='1947-02-05')return [{group:'pps',days:daysBetween(term.start,'1948-12-15')},{group:'pzpr',days:daysBetween('1948-12-15',term.end)}];return [{group:term.group,days:daysBetween(term.start,term.end||today)}];}
function getRows(terms,mode,today){const result=[];for(const t of terms){let row=mode==='people'?result.find(r=>r.name===t.name):null;if(!row){row={name:t.name,start:t.start,terms:[],days:0,segments:[]};result.push(row);}row.terms.push(t);row.days+=daysBetween(t.start,t.end||today);row.segments.push(...segments(t,today));}return result;}
if(typeof module!=='undefined')module.exports={daysBetween,warsawDate,getRows,segments};
if(typeof document!=='undefined'){
const state={era:'all',mode:'terms',sort:'chronological',query:''};let today=warsawDate();let visible=[];
const $=id=>document.getElementById(id);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized=s=>s.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
function render(){
 today=warsawDate();$('today').textContent=new Intl.DateTimeFormat('pl-PL',{dateStyle:'long',timeZone:'UTC'}).format(new Date(today+'T00:00:00Z'));$('today').dateTime=today;$('year').textContent=today.slice(0,4);$('currentDays').textContent=number.format(daysBetween('2023-12-13',today));
 const filtered=TERMS.filter(t=>(state.era==='all'||t.era===state.era)&&normalized(t.name).includes(normalized(state.query)));
 visible=getRows(filtered,state.mode,today);visible.sort((a,b)=>state.sort==='longest'?b.days-a.days:state.sort==='shortest'?a.days-b.days:state.sort==='name'?a.name.localeCompare(b.name,'pl'):a.start.localeCompare(b.start));
 const max=Math.max(1,...visible.map(r=>r.days));const step=max<=20?5:max<=100?25:max<=1000?250:max<=3000?750:max<=6000?1500:2500;const ceiling=Math.ceil(max/step/4)*step*4;
 $('axis').innerHTML=Array.from({length:5},(_,i)=>'<span>'+number.format(ceiling*i/4)+'</span>').join('');
 const groups=new Set(visible.flatMap(r=>r.segments.map(s=>s.group)));$('legend').innerHTML=Object.entries(GROUPS).filter(([k])=>groups.has(k)).map(([,v])=>'<span><i class="swatch" style="background:'+v[1]+'"></i>'+escape(v[0])+'</span>').join('');
 $('count').textContent=(state.mode==='people'?'Osoby: ':'Okresy: ')+visible.length+' · '+(state.era==='all'?'Cała historia':eras[state.era]);
 $('chart').innerHTML=visible.length?visible.map(r=>{
 const active=r.terms.some(t=>!t.end);const dates=r.terms.length===1?dateLabel(r.terms[0].start)+' – '+dateLabel(r.terms[0].end):'Okresy: '+r.terms.length+' · suma bez przerw';
 const parties=[...new Set(r.terms.map(t=>t.party))].join(' / ');
 const bar=r.segments.map(s=>'<span style="width:'+s.days/r.days*100+'%;background:'+GROUPS[s.group][1]+'"></span>').join('');
 const detail=r.terms.map(t=>'<p><strong>'+dateLabel(t.start)+' – '+dateLabel(t.end)+' · '+number.format(daysBetween(t.start,t.end||today))+' dni</strong><br>'+escape(eras[t.era]+' · '+t.party)+'. '+escape(t.note)+'</p>').join('');
 return '<details class="row"><summary><span class="name">'+escape(r.name)+(active?'<span class="active-tag">● W TRAKCIE</span>':'')+'<span class="meta">'+dates+'</span><span class="meta">'+escape(parties)+'</span></span><span class="track" aria-hidden="true"><span class="bar" style="width:'+r.days/ceiling*100+'%">'+bar+'</span></span><span class="days">'+number.format(r.days)+'<span class="sr-only"> dni</span></span></summary><div class="row-body">'+detail+'<a href="'+SOURCE+'" target="_blank" rel="noopener">Tabela źródłowa ↗</a> · <a href="https://pl.wikipedia.org/wiki/'+encodeURIComponent(r.name.replaceAll(' ','_'))+'" target="_blank" rel="noopener">Biogram ↗</a></div></details>';
 }).join(''):'<p class="empty">Brak wyników. Zmień nazwisko lub wybierz inną epokę.</p>';
}
document.querySelectorAll('[data-era]').forEach(b=>b.addEventListener('click',()=>{state.era=b.dataset.era;document.querySelectorAll('[data-era]').forEach(x=>x.setAttribute('aria-pressed',x===b));render();}));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b));render();}));
$('sort').addEventListener('change',e=>{state.sort=e.target.value;render();});$('search').addEventListener('input',e=>{state.query=e.target.value;render();});
$('download').addEventListener('click',()=>{const rows=[['Premier','Początek','Koniec / stan na','Dni','Epoka','Ugrupowanie','Uwagi'],...visible.flatMap(r=>r.terms.map(t=>[t.name,t.start,t.end||today,daysBetween(t.start,t.end||today),eras[t.era],t.party,t.note]))];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='premierzy-polski-'+today+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
setInterval(()=>{if(warsawDate()!==today)render();},30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&warsawDate()!==today)render();});render();
}
