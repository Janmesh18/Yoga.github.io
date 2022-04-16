import os
import moviepy.video.io.ImageSequenceClip
################
path0='./DATASET/TRN_REV/'
file0 = os.listdir(path0)
print(file0,"keep a note of folder of images you want to make video")
folder0=input("Enter your noted folder name: ")
image_folder = './DATASET/TRN_REV/'+folder0+'/'
#############################################
#image_folder='./DATASET/TRN_REV/downdog/'
fps=0.1

image_files = [image_folder+'/'+img for img in os.listdir(image_folder) if img.endswith(".png") or img.endswith(".jpg") or img.endswith(".bmp") or img.endswith(".JPG") or img.endswith(".PNG")]
print(image_files)
clip = moviepy.video.io.ImageSequenceClip.ImageSequenceClip(image_files, fps=fps)
clip.write_videofile('./videos/'+folder0+'.mp4')