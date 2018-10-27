from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from useraccounts.models import  Trader, UserAccount, Funds, User, Transactions, Global_var, Months
from django.contrib.auth.decorators import login_required, permission_required
from useraccounts.forms import TraderForm, UserAccountForm
from itertools import chain
from django.db.models import Q
from django.db.models import Sum
from itertools import chain #allow for merging multiple querysets frorm different models
from django.core import serializers
from snippets import populate, helpers
from datetime import datetime
import json
# Create your views here.

# populate.populate()
# populate.add_months()
# populate.populate_users()
# populate.generate_transactions()
# populate.populate_users_passwords()
 
@login_required
def index(request):
    run_budget()
    # forms = CustomersForm()
    forms = "CustomersForm"
    traders = Trader.objects.all()
    total_funds = Transactions.objects.filter(target_month__name = populate.get_month(), transaction_type = "income").aggregate(sum=Sum('amount'))['sum']
    total_expense = Transactions.objects.filter(target_month__name = populate.get_month(), transaction_type = "expense").aggregate(sum=Sum('amount'))['sum']
    overall_total_funds = Transactions.objects.filter( transaction_type = "income").aggregate(sum=Sum('amount'))['sum']
    overall_total_expense = Transactions.objects.filter(transaction_type = "expense").aggregate(sum=Sum('amount'))['sum']
    cell_leaders = UserAccount.objects.filter(user__is_superuser = False)
    budget = Months.objects.get(name = populate.get_month()).budget
    try:
        excess = total_funds - budget  
        balance =overall_total_funds - ( overall_total_expense if overall_total_expense > 0 else 0)
    except:
        excess = 0
        balance = 0
    # balance = overall_total_expense
    # print("\t\t", balance)
    useraccount = UserAccount.objects.get(user__username = request.user)
    transactions = Transactions.objects.all()
    months = Months.objects.all()
    # hotproducts = Product.objects.filter(hot = True)
    
    return render(request, 'store/index.html', {'forms':forms, 'traders':traders, 'total_funds':total_funds, 'total_expense':total_expense,'cell_leaders': cell_leaders, "Months":months, "budget":budget, "surplus":excess, "balance": balance})

@login_required
def table(request):
    traders = Trader.objects.all()
    total_funds = Funds.objects.aggregate(sum=Sum('amount'))['sum']
    useraccount = UserAccount.objects.get(user__username = request.user)
        
    cell_leaders = UserAccount.objects.filter(user__is_superuser = False)


    return render(request, 'store/table.html', { 'traders':traders, 'total_funds':total_funds, 'cell_leaders': cell_leaders})

@login_required
def tenants(request):

    tenants = UserAccount.objects.filter(user__is_superuser = False).order_by("lname")
    tenant_user = User.objects.filter(is_superuser = False).order_by("last_name")


    return render(request, 'store/tenants.html', {'tenants': tenants, "tenant_user":tenant_user})

@login_required
def edit(request):
    tenant_id = request.GET.get("id")
    tenant = UserAccount.objects.get(id = tenant_id)
    tenant_user = User.objects.get(id = tenant.user_id)

    transactions = Transactions.objects.filter(user = tenant.user_id).order_by('date')[:10]


    return render(request, 'store/edit_tenant.html', {'tenant': tenant, "tenant_user":tenant_user, 
                                                        "transactions":transactions})



@login_required
def get_data(request):

    transactions = Transactions.objects.all()
    users = User.objects.all()
    useraccounts = UserAccount.objects.all()
    global_var   = Global_var.objects.all()

    chained_list = list(chain(transactions, users, useraccounts, global_var))

    data = serializers.serialize("json", chained_list )

    return HttpResponse(data)


@login_required
def post_data(request): #save edit tenant data
    exempted_fields = ["address", "is_active"]
    tenant_id = request.GET.get("userid")

    if request.method == "POST":
        cleaned_form = helpers.clean(request.POST, exempted_fields)

        tenant = UserAccount.objects.get(id = tenant_id)
        tenant_user = User.objects.get(id = tenant.user_id)
        tenant.fname = tenant_user.first_name = cleaned_form['first_name']
        tenant.lname = tenant_user.last_name = cleaned_form['last_name']
        tenant.phone = cleaned_form['phone']
        tenant.address = cleaned_form['address']
        tenant.stays_in = cleaned_form['lives_in']
        tenant.fee = populate.set_bill(cleaned_form['lives_in'])

        tenant_user.username = cleaned_form['username']
        tenant_user.email = cleaned_form['email']
        tenant_user.is_active = tenant.is_active =  True if cleaned_form['is_active'] == "true" else False

        tenant_user.save()
        tenant.save()


        return HttpResponse(json.dumps({"response":"success"}))

    return HttpResponse(json.dumps({"response":"Error"}))

@login_required
def create_tenant(request):
    exempted_fields = ["address"]
    cleaned_form = helpers.clean(request.POST, exempted_fields)

    # try:
    if request.method == "POST":
        fname = cleaned_form['first_name']
        lname = cleaned_form['last_name']
        username = cleaned_form['username']
        email = cleaned_form['email']
        phone = cleaned_form['phone']
        address = cleaned_form['address']
        email = cleaned_form['email']
        stays_in = cleaned_form['lives_in']
        fee = populate.set_bill(cleaned_form['lives_in'])
        is_active =  True if cleaned_form['is_active'] == "true" else False
        new_user = User(first_name = fname, last_name = lname, username = username, email = email, is_active = is_active)

        new_user.save()

        new_useraccount = UserAccount(lname = lname, fname = fname, dob = "2018-03-15",  phone = phone
                                        , address = address, user_id = new_user.id, fee = fee, is_active = is_active )
        new_useraccount.save()

        new_user.set_password("alltheblessings")

        return HttpResponse(json.dumps({"response":"success"}))


    return render(request, 'store/add_tenant.html')


def run_budget():

    month = Months.objects.get(name = populate.get_month())
    budget = 0
    if (0 == 0):
        Global_Var = Global_var.objects.get(description = "Global_Variables")
        flats = UserAccount.objects.filter(user__is_active = True, stays_in = "flat").count()
        b_quarters = UserAccount.objects.filter(user__is_active = True, stays_in = "bq").count()
        # print(flats, b_quarters)
        budget = (flats * Global_Var.flat) +  (b_quarters * Global_Var.b_quarters)        
        month.budget = budget
        month.save()

@login_required
def add_income(request):
    
    tenant = UserAccount.objects.all().order_by("fname")

    return render(request, 'store/add_income.html', {"tenant":tenant})

@login_required
def save_income(request):

    tenant = UserAccount.objects.all().order_by("fname")

    if request.method == "POST":

        cleaned_form = helpers.clean(request.POST)

        amount = cleaned_form['amount']
        recieved = cleaned_form['recieved']
        month = cleaned_form['month']
        user_id = cleaned_form['user_id']
        actual_month_name = (populate.months[int(month[5:])-1]).strip() #get actual month from javascript #2018 02 format
        useraccount = UserAccount.objects.get(id = int(user_id))
        user = User.objects.get(id = useraccount.user_id)

        month = Months.objects.get(name = actual_month_name)

        new_trans = Transactions(target_month_id = month.id, amount = amount, month = month.name, 
                            user_id = user.id, date = (recieved))
        new_trans.save()

        return HttpResponse(json.dumps({"response":"success"}))

    return HttpResponse(json.dumps({"response":"Failed"}))


@login_required
def add_expense(request):

    tenant = UserAccount.objects.all().order_by("fname")

    return render(request, 'store/add_expense.html', {"tenant":tenant})


@login_required
def save_expense(request):
    tenant = UserAccount.objects.all().order_by("fname")
    # print(request.POST)
    if request.method == "POST":
        exempted_fields = "description"
        cleaned_form = helpers.clean(request.POST, exempted_fields)

        description = cleaned_form['description']
        amount = cleaned_form['amount']
        date = cleaned_form['date']
        actual_month_name = (populate.months[(datetime.strptime(date, '%Y-%m-%d')).month-1]) #get actual month from javascript format
        # useraccount = UserAccount.objects.get(id = int(user_id))
        user = User.objects.get(is_superuser = True)
        # print(user)

        month = Months.objects.get(name = actual_month_name)

        new_trans = Transactions(target_month_id = month.id, amount = amount, month = month.name, 
                                user_id = user.id, date = (date), transaction_type = "expense", description = description)
        new_trans.save()

        return HttpResponse(json.dumps({"response":"success"}))

    return HttpResponse(json.dumps({"response":"Failed"}))





















































# @login_required
# def add_leader(request):

#     form    = UserAccountForm()

#     traders = Trader.objects.all()
#     total_funds = Funds.objects.aggregate(sum=Sum('amount'))['sum']
#     cell_leaders = UserAccount.objects.filter(user__is_superuser = False)


#     if request.method == 'POST':
#         username = (request.POST['username'])
#         lname = (request.POST['last_name'])
#         fname = (request.POST['first_name'])
#         phone = (request.POST['phone'])
#         email = (request.POST['email'])
#         password = (request.POST['password'])
#         cell = (request.POST['cell_name'])
#         dob = (request.POST['dob'])
#         address = (request.POST['address'])
#         is_superuser = (request.POST.get('is_superuser', False))
#         user = User.objects.filter(username = username)

#         if user:
#             error = "Username already exists"
#             return render(request, 'store/add_leader.html', {"error":error, 'form':form, 'traders':traders, 'total_funds':total_funds, 'cell_leaders': cell_leaders})
        
#         new_user = User(first_name = fname, last_name = lname, username = username, email = email, is_superuser = check_value(is_superuser))

#         new_user.save()

#         new_useraccount = UserAccount( dob = format_date(dob), phone = phone, address = address,
#                                         cell = cell, user_id = new_user.id )
#         new_useraccount.save()

#         new_user.set_password(password)


#         if form.is_valid():
#             form.cleaned_data("username")
#             print("-----------------------------")

#     return render(request, 'store/add_leader.html', { 'form':form, 'traders':traders, 'total_funds':total_funds, 'cell_leaders': cell_leaders})






# @login_required
# def add(request):
#     traders = Trader.objects.all()
#     total_funds = Funds.objects.aggregate(sum=Sum('amount'))['sum']
#     cell_leaders = UserAccount.objects.filter(user__is_superuser = False)

#     form    = TraderForm()
#     result  = {}

#     if request.method == 'POST':
#         lname = (request.POST['lname'])
#         fname = (request.POST['fname'])
#         phone = (request.POST['phone'])
#         products = (request.POST['products'])
#         income = ( request.POST['income'])
#         occupation = ( request.POST['occupation'])
#         dob = ( request.POST['dob'])
#         business_date = ( request.POST['business_date'])
#         city = ( request.POST['city'])
#         business_worth = ( request.POST['business_worth'])
#         address = ( request.POST['address'])
#         why_no_spouse = ( request.POST['why_no_spouse'])
#         trade_address = ( request.POST['trade_address'])
#         why_no_spouse = ( request.POST['why_no_spouse'])
#         business_needs = ( request.POST['business_needs'])
#         supplier = ( request.POST['supplier'])
#         cell_name = ( request.POST['cell_name'])
#         num_kids = ( request.POST['num_kids'])
#         fund_needed = ( request.POST['fund_needed'])
#         do_you_save = (request.POST.get('do_you_save', False))
#         have_kids = (request.POST.get('have_kids', False))
#         change_business = (request.POST.get('change_business', False))
#         with_spouse = (request.POST.get('with_spouse', False))
#         cell_lead = User.objects.get(username = "admin")

#         # Attempt to grab information from the raw form information.
#         # Note that we make use of both UserForm and UserProfileForm.

#         if request.user.is_authenticated :

#             new_trader = Trader(lname = lname, fname = fname, phone = phone, products= products,income = income, do_you_save = check_value(do_you_save), 
#                                 have_kids = check_value(have_kids), num_kids = num_kids, occupation = occupation, business_date = format_date(business_date), dob = format_date(dob), city = city, address = address, 
#                                 trade_address = trade_address, business_worth = business_worth, with_spouse = check_value(with_spouse), why_no_spouse = why_no_spouse, 
#                                 business_needs = business_needs, supplier = supplier, change_business = check_value(change_business), fund_needed = fund_needed, 
#                                 cell_name = cell_name, cell_leader_id = cell_lead.id)


#             new_trader.save()
#             print(new_trader)

#         add_traderForm = TraderForm(request.POST)

#     return render(request, 'store/add_trader.html', { 'form':form, 'traders':traders, 'total_funds':total_funds, 'cell_leaders': cell_leaders})







# def category(request, slug):
#     cat = Category.objects.all()

#     subcat = SubCategory.objects.all()
#     print(type(cat))

#     products = Product.objects.all()
#     if slug != "all" :
#         products = Product.objects.filter(category__slug = slug)
#         current_category = Category.objects.get(slug = slug)
    
#     elif slug == "all":
#         products = Product.objects.all()
#         current_category = "ALL PRODUCTS"

#     return render(request, 'store/category.html', {"current_category":current_category, 'products': products, 'cat':cat, "subcat":subcat} )

# def subcategory(request, slug):
#     cat = Category.objects.all()

#     subcat = SubCategory.objects.all()
#     print(type(cat))

#     products = Product.objects.all()
#     if slug :
#         products = Product.objects.filter(subcategory__slug = slug)
#         current_category = SubCategory.objects.get(slug = slug)

#     return render(request, 'store/category.html', {"current_category":current_category, 'products': products, 'cat':cat, "subcat":subcat} )

# def single(request, slug):
#     product = Product.objects.get(slug = slug)
#     subcat = SubCategory.objects.all()
#     cat = Category.objects.all()
#     subcat = SubCategory.objects.all()
#     hotproducts = Product.objects.filter(hot = True)

#     hotproducts = Product.objects.filter(hot = True)


#     return render(request, 'store/single.html', { 'product': product, 'cat':cat, "subcat":subcat, "hotproducts":hotproducts} )


# def address(request):
#     forms = CustomersForm()
#     if request.method == "POST":
#         postmail = (request.POST["data"])
#         addresses = Customers.objects.filter(email = postmail)

#         if addresses.exists():
#             print('email exists')
#         else:
#             newmail = Customers(email = postmail)
#             newmail.save()

#     return HttpResponse(("addresses"))

# def checkout(request):
#     subcat = SubCategory.objects.all()
#     cat = Category.objects.all()
#     subcat = SubCategory.objects.all()
#     hotproducts = Product.objects.filter(hot = True)
#     print(request.GET)
#     hotproducts = Product.objects.filter(hot = True)


#     return render(request, 'store/checkout.html', { 'cat':cat, "subcat":subcat, "hotproducts":hotproducts} )

# def search(request):
#     cat = Category.objects.all() #FOR NAV BAR RENDERING AND SIDE OPTIONS RENDERING

#     subcat = SubCategory.objects.all()
#     query = (request.GET["Product"])
#     form    = SearchForm()
#     result  = {}
#     # if request.method == 'POST':
#     # Attempt to grab information from the raw form information.
#     # Note that we make use of both UserForm and UserProfileForm.
#     search_form = SearchForm(data=request.POST)
#     # if search_form.is_valid():
        
#     # query = request.GET['name']
#     # print(query)
    
        
#     try:
#         result = Product.objects.filter( Q(name__icontains = query) | Q(description__icontains = query))
#         # result2 = Product.objects.filter( Q(description__icontains = query))
#         # result = list(chain(result, result2))
#         print("result-----------------------", result)

#         return render(request, 'store/category.html', {"current_category":"RESULTS", 'products': result, 'cat':cat, "subcat":subcat} )

#     except:
#         print("result-----------------------")
#         return render(request, 'store/category.html', {"current_category":"RESULTS", 'products': result, 'cat':cat, "subcat":subcat} )
            
#     return render(request, 'store/category.html', {"current_category":"RESULTS", 'products': result, 'cat':cat, "subcat":subcat} )
