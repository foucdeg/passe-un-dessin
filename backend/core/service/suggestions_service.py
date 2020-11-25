import unicodedata

from django.db.models import Q

from core.constants import DEFAULT_LANGUAGE, LANGUAGE_EN, LANGUAGE_FR, LANGUAGES
from core.models import Suggestion


def remove_articles(sentence, language):
    articles = []
    if language == LANGUAGE_FR:
        articles = ["un ", "une ", "le ", "la ", "l'", "les ", "des "]
    if language == LANGUAGE_EN:
        articles = ["the ", "a ", "an "]

    sanitized_sentence = sentence
    for article in articles:
        sanitized_sentence = sanitized_sentence.replace(article, "")
    return sanitized_sentence


def sanitize_sentence(sentence, language=LANGUAGE_FR):
    if language:
        sentence = remove_articles(sentence.lower(), language)

    sentence = "".join(e for e in sentence if e.isalpha())
    return str(
        unicodedata.normalize("NFD", sentence)
        .encode("ascii", "ignore")
        .decode("utf-8")
    )


def get_random(requested_language: str, count: int, only_single_words=False):
    language = (
        requested_language if requested_language in LANGUAGES else DEFAULT_LANGUAGE
    )
    query = Suggestion.objects.filter(language=language)
    if only_single_words:
        query = query.exclude(
            Q(sentence__contains=" ")
            | Q(sentence__contains=".")
            | Q(sentence__contains="'")
            | Q(sentence__contains="-")
        )

    return list(query.order_by("?").values_list("sentence", flat=True)[:count])
