import random

from django.core.files import File


class SuggestionEngine:
    class __SuggestionEngine:
        words = {"en": [], "fr": []}
        single_words = {"en": [], "fr": []}

        def load(self, language: str, file_to_load: File):
            for suggestion in file_to_load:
                suggestion = suggestion.strip()
                self.words[language].append(suggestion)

                if len(suggestion.split()) == 1:
                    self.single_words[language].append(suggestion)


        def get_random(self, language: str, count: int):
            return random.choices(self.words[language], k=count)


        def get_single_word_random(self, language: str, count: int):
            return random.choices(self.single_words[language], k=count)

        def get_supported_languages(self):
            return self.words.keys()

    instance = None

    def __init__(self):
        if not SuggestionEngine.instance:
            SuggestionEngine.instance = SuggestionEngine.__SuggestionEngine()

    def __getattr__(self, name):
        return getattr(self.instance, name)
