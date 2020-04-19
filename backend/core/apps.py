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
        suggestions_file = fs.open("word_list.txt", "r")

        engine = SuggestionEngine()
        engine.load(suggestions_file)
