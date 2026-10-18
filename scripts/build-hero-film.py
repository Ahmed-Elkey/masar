"""Build a native-speed montage with a continuous garden shot across the loop."""
from pathlib import Path
import json, subprocess
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
TMP=ROOT/'tmp/video-edit'
TMP.mkdir(parents=True,exist_ok=True)
# The last frame advances into the first within the same original camera move.
shots=[('mivida',3,3,'Garden camera move: second half'),
       ('ora',38,3.4,'Interior'),
       ('ora',44,3.4,'Architecture'),
       ('mivida',25.5,3,'Evening aerial'),
       ('mivida',0,3,'Garden camera move: first half')]
for i,(source,start,duration,description) in enumerate(shots):
    vf=f'trim=duration={duration},setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,fps=30,format=yuv420p'
    subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-ss',str(start),'-i',str(ROOT/f'public/videos/{source}-official.mp4'),'-an','-vf',vf,'-c:v','libx264','-preset','fast','-crf','19','-y',str(TMP/f'clean-{i}.mp4')],check=True)
listing=TMP/'clean-concat.txt'
listing.write_text(''.join(f"file '{TMP/f'clean-{i}.mp4'}'\n" for i in range(len(shots))))
out=TMP/'clean-complete.mp4'
subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart','-y',str(out)],check=True)
out.replace(ROOT/'public/videos/egypt-property-film.mp4')
manifest={'output':'egypt-property-film.mp4','duration':sum(s[2] for s in shots),'speed':1,'editing':'Native-speed cuts; no artificial slow motion or overlapping dissolves.','loopSeam':'Original Mivida garden shot at source time 3 seconds.','shots':[dict(source=s,start=t,duration=d,description=desc) for s,t,d,desc in shots]}
(ROOT/'public/videos/film-edit.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Built native-speed film')
