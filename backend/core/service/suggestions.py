import random

from django.core.files import File


class SuggestionEngine:
    class __SuggestionEngine:
        words = []

        def load(self, file_to_load: File):
            for suggestion in file_to_load:
                self.words.append(suggestion.strip())

        def get_random(self, count: int):
            return random.choices(self.words, k=count)

    instance = None

    def __init__(self):
        if not SuggestionEngine.instance:
            SuggestionEngine.instance = SuggestionEngine.__SuggestionEngine()

    def __getattr__(self, name):
        return getattr(self.instance, name)
