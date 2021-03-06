# Generated by Django 2.0 on 2018-10-21 11:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Funds',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Fund',
            },
        ),
        migrations.CreateModel(
            name='Global_var',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('flat', models.IntegerField(default=26000)),
                ('b_quarters', models.IntegerField(default=12400)),
                ('description', models.CharField(blank=True, default='Global_Variables', max_length=40)),
            ],
        ),
        migrations.CreateModel(
            name='Months',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default=0, max_length=40, null=True)),
                ('date', models.DateField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Month',
            },
        ),
        migrations.CreateModel(
            name='Trader',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('occupation', models.CharField(blank=True, max_length=256, null=True)),
                ('phone', models.CharField(blank=True, max_length=40, null=True)),
                ('fname', models.CharField(blank=True, max_length=40, null=True)),
                ('lname', models.CharField(blank=True, max_length=40, null=True)),
                ('dob', models.DateField(blank=True, max_length=40, null=True)),
                ('city', models.CharField(blank=True, max_length=40, null=True)),
                ('address', models.CharField(blank=True, max_length=40, null=True)),
                ('trade_address', models.CharField(blank=True, max_length=50, null=True)),
                ('products', models.CharField(blank=True, max_length=40, null=True)),
                ('business_date', models.DateField(blank=True, max_length=40, null=True)),
                ('business_worth', models.IntegerField(blank=True, null=True)),
                ('have_kids', models.BooleanField()),
                ('num_kids', models.IntegerField(blank=True, null=True)),
                ('with_spouse', models.BooleanField()),
                ('why_no_spouse', models.CharField(blank=True, max_length=20, null=True)),
                ('business_needs', models.CharField(blank=True, max_length=40, null=True)),
                ('income', models.IntegerField(blank=True, null=True)),
                ('supplier', models.CharField(blank=True, max_length=20, null=True)),
                ('change_business', models.BooleanField()),
                ('fund_needed', models.IntegerField(blank=True, null=True)),
                ('do_you_save', models.BooleanField()),
                ('cell_name', models.CharField(blank=True, max_length=40, null=True)),
                ('added', models.DateField(auto_now=True)),
                ('slug', models.SlugField(max_length=150, unique=True)),
                ('cell_leader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(blank=True, null=True)),
                ('month', models.CharField(blank=True, default=0, max_length=40, null=True)),
                ('date', models.DateField(blank=True, default='', max_length=40, null=True)),
                ('transaction_type', models.CharField(default='income', max_length=9, null=True)),
                ('description', models.CharField(default='income', max_length=200, null=True)),
                ('target_month', models.ForeignKey(default='admin', on_delete=django.db.models.deletion.CASCADE, to='main.Months')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Transaction',
            },
        ),
        migrations.CreateModel(
            name='UserAccount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('occupation', models.CharField(blank=True, default=' ', max_length=256, null=True)),
                ('phone', models.CharField(blank=True, default=0, max_length=40, null=True)),
                ('dob', models.DateField(blank=True, default='', max_length=40, null=True)),
                ('address', models.CharField(blank=True, max_length=40, null=True)),
                ('stays_in', models.CharField(default='flat', max_length=40, null=True)),
                ('fee', models.IntegerField(blank=True, null=True)),
                ('balance', models.IntegerField(blank=True, null=True)),
                ('fname', models.CharField(default='New', max_length=40, null=True)),
                ('lname', models.CharField(default='User', max_length=40, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='funds',
            name='trader',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Trader'),
        ),
    ]
