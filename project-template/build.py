from pathlib import Path
import json,html,re
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'project-template/projects.json').read_text())
template=(root/'project-template/template.html').read_text()
for i,p in enumerate(data):
 next_project=data[(i+1)%len(data)]
 values={k:html.escape(str(v),quote=True) for k,v in p.items() if not isinstance(v,list)}
 values.update(number=f'{i+1:02}',next_number=f'{(i+1)%len(data)+1:02}')
 for key in ['slug','name','color','logo','ink']:values['next_'+key]=html.escape(next_project[key],quote=True)
 values['facts']=''.join(f'<div><dt>{html.escape(k)}</dt><dd>{html.escape(v)}</dd></div>' for k,v in p['facts'])
 values['features']=''.join(f'<article class="feature-row"><span class="feature-number">{j+1:02}</span><h3 class="reveal">{html.escape(title)}</h3><p class="reveal">{html.escape(copy)}</p></article>' for j,(title,copy) in enumerate(p['features']))
 page=re.sub(r'\{\{(\w+)\}\}',lambda m:values[m[1]],template)
 folder=root/'projects'/p['slug'];folder.mkdir(parents=True,exist_ok=True);(folder/'index.html').write_text(page)
 print('Built',p['slug'])
