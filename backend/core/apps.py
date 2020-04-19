import os

from django.apps import AppConfig
from django.core.files.storage import FileSystemStorage

import core
from core.service.suggestions import SuggestionEngine


class CoreConfig(AppConfig):
    name = "core"

    def ready(self):
        path = os.path.dirname(core.__file__)
        fs = FileSystemStorage(location=path)
        suggestions_file_fr = fs.open("word_list_fr.txt", "r")
        suggestions_file_en = fs.open("word_list_en.txt", "r")

        engine = SuggestionEngine()
        engine.load("fr", suggestions_file_fr)
        engine.load("en", suggestions_file_en)

        suggestions_file_fr.close()
        suggestions_file_en.close()
