# Generated by Django 5.0.7 on 2024-12-12 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0003_rename_relates_to_task_owner'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]
