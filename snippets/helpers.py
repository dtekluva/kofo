def clean(txt, exempt):
    """form query dict and fields to exempt from cleaning, returns form values 
        without spaces upgrade later to remove special chars"""
    new_dict = {}
    for key in txt:
        new_dict[key] = ((txt[key]).strip()).lower()
        if key not in exempt:
            new_dict[key] = (new_dict[key]).replace(" ","")
    return new_dict