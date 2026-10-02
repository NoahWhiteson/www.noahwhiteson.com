from pathlib import Path
import json,html,re
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'project-template/projects.json').read_text())
template=(root/'project-template/template.html').read_text()
for i,p in enumerate(data):
 next_project=data[(i+1)%len(data)]
 values={k:html.escape(str(v),quote=True) for k,v in p.items() if not isinstance(v,list)}
 values.update(number=f'{i+1:02}',next_number=f'{(i+1)%len(data)+1:02}')
 for key in ['slug','name','color','logo','ink','tint']:values['next_'+key]=html.escape(next_project[key],quote=True)
 values['facts']=''.join(f'<div><dt>{html.escape(k)}</dt><dd>{html.escape(v)}</dd></div>' for k,v in p['facts'])
 splits={'safesight':('Safe','sight.'),'undersphere':('Under','sphere.'),'volunteen':('Volun','teen.'),'gosteer':('Go','Steer.'),'storebase':('Store','base.')}
 values['title_first'],values['title_last']=splits[p['slug']]
 values['logo_layers']=''.join(f'<img class="emblem-layer" style="--layer:{j}" src="../../assets/{html.escape(p["logo"])}" width="500" height="500" alt="">' for j in range(12,0,-1))
 values['statement_letters']=' '.join('<span class="statement-word">'+''.join('<span class="statement-char" aria-hidden="true">'+html.escape(c)+'</span>' for c in word)+'</span>' for word in p['headline'].split())
 note=p['note'].rstrip('.')
 values['note_letters']=''.join('<span class="ending-char">'+html.escape(c)+'</span>' for c in note)+'<span class="static-period">.</span>'
 values['features']=''.join(f'<article class="feature-chapter" data-chapter="{j}"><span class="feature-number">{j+1:02} / 03</span><h3>{html.escape(title)}</h3><p>{html.escape(copy)}</p></article>' for j,(title,copy) in enumerate(p['features']))
 page=re.sub(r'\{\{(\w+)\}\}',lambda m:values[m[1]],template)
 folder=root/'projects'/p['slug'];folder.mkdir(parents=True,exist_ok=True);(folder/'index.html').write_text(page)
 print('Built',p['slug'])
