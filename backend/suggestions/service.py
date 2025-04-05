import unicodedata

from django.db.models import Q

from suggestions.models import Language, Suggestion, SuggestionStatus


def remove_articles(sentence, language):
    articles = []
    if language == Language.FR.value:
        articles = ["un ", "une ", "le ", "la ", "l'", "les ", "des "]
    if language == Language.EN.value:
        articles = ["the ", "a ", "an "]
    if language == Language.DE.value:
        articles = [
            "der ",
            "die ",
            "das ",
            "den ",
            "dem ",
            "des ",
            "ein ",
            "eine ",
            "einen ",
            "einem ",
            "einer ",
            "eines ",
        ]

    sanitized_sentence = sentence
    for article in articles:
        sanitized_sentence = sanitized_sentence.replace(article, "")
    return sanitized_sentence


def sanitize_sentence(sentence, language=Language.FR.value):
    if language:
        sentence = remove_articles(sentence.lower(), language)

    sentence = "".join(e for e in sentence if e.isalpha())
    return str(
        unicodedata.normalize("NFD", sentence).encode("ascii", "ignore").decode("utf-8")
    )


def get_random(requested_language: str, count: int, only_single_words=False):
    language = (
        requested_language
        if requested_language in [language.value for language in Language]
        else Language.EN.value
    )
    query = Suggestion.objects.filter(
        language=language, status=SuggestionStatus.ACTIVE.value
    )
    if only_single_words:
        query = query.exclude(
            Q(sentence__contains=" ")
            | Q(sentence__contains=".")
            | Q(sentence__contains="'")
            | Q(sentence__contains="-")
        )

    return list(query.order_by("?").values_list("sentence", flat=True)[:count])
