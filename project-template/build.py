from pathlib import Path
import json,html,re
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'project-template/projects.json').read_text())
template=(root/'project-template/template.html').read_text()
# Art direction per project, with the same structure and motion as the portfolio.
design={
 'safesight':dict(hero_a='#245bd8',hero_b='#72aaff',hero_c='#b398ef',mask_mode='alpha',title=['Safe','sight'],role=['home','safety'],intro=['A second','set of eyes.'],preview_image='safesight-screen.webp',preview_width=464,preview_height=960,preview_class='phone-preview',crop=(0,0,464,960),preview_alt='Safesight app home screen with House Score, scan history and hazard summary',preview_caption='The home screen brings your scans and safety checks together.'),
 'undersphere':dict(hero_a='#14795b',hero_b='#73b68e',hero_c='#bacd7d',mask_mode='alpha',title=['Under','sphere'],role=['browser','FPS'],intro=['A different','kind of gravity.'],preview_image='undersphere.png',preview_width=1920,preview_height=919,preview_class='game-preview',crop=(0,0,1920,919),preview_alt='Undersphere gameplay inside a spherical world, with weapons and player HUD',preview_caption='Inside the sphere. A gameplay view from Undersphere.'),
 'volunteen':dict(hero_a='#7040e8',hero_b='#b585f7',hero_c='#ffa8c7',mask_mode='alpha',title=['Volun','teen'],role=['give your','time'],intro=['Find your','place to help.'],preview_image='volunteen-site.jpg',preview_width=1363,preview_height=936,preview_class='web-preview',crop=(10,7,1345,921),preview_alt='Volunteen sign-up page with its colourful visual identity',preview_caption='Getting started with Volunteen.'),
 'gosteer':dict(hero_a='#14795b',hero_b='#77be91',hero_c='#d7e775',mask_mode='luminance',title=['Go','Steer'],role=['wallet','by words'],intro=['Your wallet.','In your words.'],preview_image='steer-site.jpg',preview_width=1348,preview_height=926,preview_class='web-preview',crop=(142,173,1050,495),preview_alt='GoSteer interface showing portfolio holdings and the chat input',preview_caption='Your holdings and the conversation, in one place.'),
 'storebase':dict(hero_a='#ed7022',hero_b='#ffab68',hero_c='#f998bd',mask_mode='alpha',title=['Store','base'],role=['files on','your terms'],intro=['Your files.','Your server.'],preview_image='storebase-site.jpg',preview_width=1348,preview_height=926,preview_class='web-preview',crop=(99,435,1180,483),preview_alt='Storebase file browser with folders, files, search and navigation',preview_caption='The file browser. Familiar folders, hosted on your machine.')
}
for i,p in enumerate(data):
 next_project=data[(i+1)%len(data)]
 d=design[p['slug']];nd=design[next_project['slug']]
 values={k:html.escape(str(v),quote=True) for k,v in p.items() if not isinstance(v,list)}
 values.update({k:html.escape(str(v),quote=True) for k,v in d.items() if not isinstance(v,(list,tuple))})
 values.update(number=f'{i+1:02}',next_number=f'{(i+1)%len(data)+1:02}')
 for key in ['slug','name','logo']:values['next_'+key]=html.escape(next_project[key],quote=True)
 for key in ['hero_a','hero_b','hero_c','mask_mode']:values['next_'+key]=nd[key]
 values['title_first'],values['title_last']=map(html.escape,d['title'])
 values['role_lines']='<br>'.join(map(html.escape,d['role']))
 values['intro_lines']=''.join('<span>'+html.escape(line)+'</span>' for line in d['intro'])
 values['facts']=''.join(f'<div><dt>{html.escape(k)}</dt><dd>{html.escape(v)}</dd></div>' for k,v in p['facts'])
 values['logo_layers']=''.join(f'<span class="logo-layer" style="--layer:{j}"></span>' for j in range(20,0,-1))
 values['features']=''.join(f'<article class="feature-chapter"><span class="feature-number">{j+1:02} / 03</span><h3>{html.escape(title)}</h3><p>{html.escape(copy)}</p></article>' for j,(title,copy) in enumerate(p['features']))
 values['wave_chars']=''.join('<span class="wave-char">'+html.escape(c)+'</span>' for c in 'On to the next one')
 x,y,w,h=d['crop'];values.update(crop_ratio=f'{w}/{h}',crop_width=f'{d["preview_width"]/w*100:.5f}',crop_x=f'{-x/w*100:.5f}',crop_y=f'{-y/h*100:.5f}')
 page=re.sub(r'\{\{(\w+)\}\}',lambda m:values[m[1]],template)
 folder=root/'projects'/p['slug'];folder.mkdir(parents=True,exist_ok=True);(folder/'index.html').write_text(page)
 print('Built',p['slug'])
