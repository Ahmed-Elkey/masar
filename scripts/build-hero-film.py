"""Build the hero film: a native-speed montage that loops without a visible seam."""
from pathlib import Path
import json, subprocess
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
TMP=ROOT/'tmp/video-edit'
TMP.mkdir(parents=True,exist_ok=True)
SIZE='1920:1080'
# Source time is measured on mivida-official.mp4. The film ends on the same continuous
# night drone push it opens with, so the loop boundary is inside one camera move.
# ORA's film is excluded: its logo and marketing captions are burned into nearly every frame.
# Source time 0-2 carries a Mivida watermark, so no shot starts before 2.5s.
shots=[(27.5,3.0,'Night drone push over the lit street grid'),
       (3.0,3.0,'Garden aerials and the jacaranda roundabout'),
       (15.0,3.0,'Clubhouse courtyard and pool decks'),
       (18.0,3.0,'Padel courts and lawn wellness'),
       (9.0,3.0,'Retail promenade and tree-lined boulevard'),
       (12.0,3.0,'Café terrace lifestyle'),
       (21.0,3.0,'Lake District at blue hour'),
       (24.0,3.5,'Dusk waterfront rising into the night aerial')]
for i,(start,duration,description) in enumerate(shots):
    vf=f'scale={SIZE}:force_original_aspect_ratio=increase,crop={SIZE},setsar=1,fps=24,format=yuv420p'
    subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-i',str(ROOT/'public/videos/mivida-official.mp4'),
                    '-ss',str(start),'-t',str(duration),'-an','-vf',vf,
                    '-c:v','libx264','-preset','slow','-tune','film','-crf','27','-y',str(TMP/f'clean-{i}.mp4')],check=True)
listing=TMP/'clean-concat.txt'
listing.write_text(''.join(f"file '{TMP/f'clean-{i}.mp4'}'\n" for i in range(len(shots))))
out=TMP/'clean-complete.mp4'
subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart','-y',str(out)],check=True)
out.replace(ROOT/'public/videos/egypt-property-film.mp4')
manifest={'output':'egypt-property-film.mp4','source':'mivida-official.mp4','duration':sum(s[1] for s in shots),
          'speed':1,'resolution':'1920x1080','frameRate':24,'audio':'none',
          'audioNote':'Silent by design. The Mivida source clip has no audio stream, and no music bed is wanted.',
          'editing':'Native-speed cuts; no artificial slow motion or overlapping dissolves.',
          'loopSeam':'One continuous night drone push, split between the last and first shot.',
          'shots':[dict(source='mivida-official.mp4',start=s,duration=d,description=desc) for s,d,desc in shots]}
(ROOT/'public/videos/film-edit.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Built hero film')
