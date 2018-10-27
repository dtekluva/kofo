def clean(txt, exempt = "none"):
    """form query dict and fields to exempt from cleaning, returns form values 
        without spaces upgrade later to remove special chars"""

    new_dict = {}
    for key in txt:
        new_dict[key] = ((txt[key]).strip()).lower()
        if key not in exempt:
            new_dict[key] = (new_dict[key]).replace(" ","")
    return new_dict


def format_date(date):
    "**Change date format for django**"
    date = date.split("/")

    return (date[2]+"-"+date[1]+"-"+date[0])



def check_value(value):
    
    if value == "on":
        return True
    
    else:
        return value