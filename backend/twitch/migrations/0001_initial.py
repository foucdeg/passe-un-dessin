# Generated by Django 3.1.4 on 2020-12-22 23:00

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Polling',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('PROCESSING', 'PROCESSING'), ('ERROR', 'ERROR'), ('SUCCESS', 'SUCCESS')], max_length=20)),
                ('streams_count', models.IntegerField(null=True)),
                ('new_streams_count', models.IntegerField(null=True)),
                ('ended_at', models.DateTimeField(null=True)),
            ],
            options={
                'get_latest_by': 'created_at',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Streamer',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('twitch_id', models.CharField(max_length=20)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'get_latest_by': 'created_at',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Stream',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('twitch_id', models.CharField(max_length=20)),
                ('type', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=1000)),
                ('viewer_count', models.IntegerField()),
                ('started_at', models.DateTimeField()),
                ('language', models.CharField(max_length=20)),
                ('thumbnail_url', models.CharField(max_length=255)),
                ('streamer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='streamers', to='twitch.streamer')),
            ],
            options={
                'get_latest_by': 'created_at',
                'abstract': False,
            },
        ),
    ]
