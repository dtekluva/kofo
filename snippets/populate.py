from useraccounts.models import  Trader, UserAccount, Funds, User, Transactions, Global_var, Months
from datetime import date
from datetime import datetime
import random 

months = ["january", "february", "march", "april", "may", "june", "july", 
            "august", "september", "october", "november", "december"]

address = ["bq", "bq","bq", "bq", "flat", "flat", "flat", "flat", "flat", "flat", "flat", "flat"]

fname = ["Pent", "House","Harrison", "Afeez", "Bakare","Adetugbogbo", "Bruno", 
            "Osokpor", "Justus", "Shogo", "Stella", "Udoh"]

lname = ["Akanbi", "Ayorinde", "Charles", "Adeshina", "Oluyinka", "Orimogunje", 
            "Inyang", "Augustine","Seriki","Olateju", "Adeduro","Onu", "Uzoamaka"
]

amount = [5000.00, 27000.00, 27000, 27000.00, 27000.00, 27000.00,
            16500.00, 27000.00,12400.00,000.00,20000.00,27000.00]


# month = Months.objects.get(name = "march")


def add_months():
    for i in range(len(months)):
        # if months[i] == "march":
            new_month = Months.objects.create(name = months[i])
            new_month.save()

def populate_transactions() : #deprecated use generate_transactions() below
    for i in range(len(amount)):
        user = User.objects.get(username = fname[i])
        new_trans = Transactions(target_month_id = month.id, amount = 12000, month = "march", 
                                user_id = user.id, date = "2018-03-15")
        new_trans.save()

def populate_users():

    for i in range(len(fname)):
        new_user = User(first_name = fname[i], last_name = lname[i], username = fname[i], email = fname[i]+"@gmail.com")

        new_user.save()

        new_useraccount = UserAccount(lname = lname[i], fname = fname[i], dob = "2018-03-15",  phone = "08031346306"
                                        , address = address[i], user_id = new_user.id, fee = set_bill(address[i]) )
        new_useraccount.save()

        new_user.set_password("19sedimat54")

def set_bill(lives_in):
        fees = Global_var.objects.get(description = "Global_Variables")
        flat_fee = fees.flat
        bq_fee = fees.b_quarters

        if lives_in == "flat":
                return flat_fee

        elif lives_in == "bq":
                return bq_fee

def generate_transactions():
        

        for i in range(len(months)):
                month = Months.objects.get(name = months[i])
                for x in range(len(fname)):
                        randomInt =random.randint(0,11)
                        print(x)

                        user = User.objects.get(first_name = fname[x])
                        print(user.first_name)
                        print(month.name)
                        new_trans = Transactions(target_month_id = month.id, amount = amount[randomInt], 
                                                        month = months[i], user_id = user.id)

                        new_trans.save()
                        

def get_month():
        current_month = datetime.now().month
        return months[current_month-1]

def populate_users_passwords():

    for i in range(len(fname)):
        new_user = User.objects.get(username = fname[i])
        # new_user = User(first_name = fname[i], last_name = lname[i], username = fname[i], email = fname[i]+"@gmail.com")

        # new_user.save()

        # new_useraccount = UserAccount(lname = lname[i], fname = fname[i], dob = "2018-03-15",  phone = "08031346306"
        #                                 , address = address[i], user_id = new_user.id, fee = set_bill(address[i]) )
        new_user.set_password("19sedimat54")
        new_user.save()
