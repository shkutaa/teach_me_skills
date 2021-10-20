# Generated by Django 3.2.7 on 2021-09-26 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='availability',
            field=models.BooleanField(default='True'),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=255, unique=True, verbose_name='Название'),
        ),
    ]