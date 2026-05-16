from django.contrib import admin
from .models import Lesson, Quiz, Conversation, Message

admin.site.register(Lesson)
admin.site.register(Quiz)
admin.site.register(Conversation)
admin.site.register(Message)