import cv2
import numpy as np
import os
def resize_image(img, size):

    h, w = img.shape[:2]
    c = img.shape[2] if len(img.shape)>2 else 1

    if h == w: 
        return cv2.resize(img, size, cv2.INTER_AREA)

    dif = h if h > w else w

    interpolation = cv2.INTER_AREA if dif > (size[0]+size[1])//2 else cv2.INTER_CUBIC

    x_pos = (dif - w)//2
    y_pos = (dif - h)//2

    if len(img.shape) == 2:
        mask = np.zeros((dif, dif), dtype=img.dtype)
        mask[y_pos:y_pos+h, x_pos:x_pos+w] = img[:h, :w]
    else:
        mask = np.zeros((dif, dif, c), dtype=img.dtype)
        mask[y_pos:y_pos+h, x_pos:x_pos+w, :] = img[:h, :w, :]

    return cv2.resize(mask, size, interpolation)

if __name__ == "__main__":
    path0='./DATASET/TRAIN/'
    file0 = os.listdir(path0)
    print(file0,"keep a note of folder of images you want to resize to make video")
    folder0=input("Enter your noted folder name: ")
    src_path = './DATASET/TRAIN/'+folder0+'/'
    print("next step...")
    path1='./DATASET/TRAIN/'
    file1 = os.listdir(path0)
    print(file1,"keep a note of folder you want to keep your resized/updated images to make video")
    folder1=input("Enter your noted folder name: ")
    dst_path = './DATASET/TRN_REV/'+folder1+'/'

    files = os.listdir(src_path)
    for file in files:
        print(file)
        f_path = src_path+file
        print(f_path)
        img = cv2.imread(f_path)
        print(img)
        img = resize_image(img,size=(750,750))
        print(img)
        cv2.imwrite(dst_path+file,img)

