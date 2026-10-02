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
 splits={'safesight':('Safe','sight'),'undersphere':('Under','sphere'),'volunteen':('Volun','teen'),'gosteer':('Go','Steer'),'storebase':('Store','base')}
 values['title_first'],values['title_last']=splits[p['slug']]
 details={'safesight':('safesight-screen.webp','phone-detail','Safesight mobile app screen'),'volunteen':('volunteen-hero.png','wide-detail','Volunteen website visual'),'undersphere':('undersphere.png','game-detail','A close-up of the spherical world in Undersphere'),'gosteer':('steer-site.jpg','wallet-detail','Detail of the GoSteer chat and portfolio interface'),'storebase':('storebase-site.jpg','storage-detail','Detail of the Storebase file browser')}
 values['detail_image'],values['detail_class'],values['detail_alt']=details[p['slug']]
 values['features']=''.join(f'<article class="feature"><span>{j+1:02}</span><div><h3>{html.escape(title)}</h3><p>{html.escape(copy)}</p></div></article>' for j,(title,copy) in enumerate(p['features']))
 page=re.sub(r'\{\{(\w+)\}\}',lambda m:values[m[1]],template)
 folder=root/'projects'/p['slug'];folder.mkdir(parents=True,exist_ok=True);(folder/'index.html').write_text(page)
 print('Built',p['slug'])
