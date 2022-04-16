from moviepy.editor import VideoFileClip, concatenate_videoclips,CompositeVideoClip
import os
#clip=VideoFileClip("./videos/downdog.mp4")
#clip2=VideoFileClip("./videos/downdog.mp4")
#print(clip,clip2)
#final_clip=concatenate_videoclips([clip,clip2])
#final_clip.write_videofile("merge.mp4")
folder="./videos"
fil = [folder+'/'+v for v in os.listdir(folder)]
b=[]
for n in fil:
    a=VideoFileClip(n)
    b.append(a)
print(b)
final_clip=concatenate_videoclips(b)
final_clip.write_videofile("./F_video/yogaji.mp4")