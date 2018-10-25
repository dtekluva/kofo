from PIL import Image



def shrink(name, dim):

    img = Image.open(name)
    # print(img)
    if img.size[1] != dim:
        img = img.resize((dim,dim), Image.ANTIALIAS)
        img.save(name)
