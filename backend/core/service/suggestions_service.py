import unicodedata


def remove_articles(sentence, language):
    articles = []
    if language == "fr":
        articles = ["un ", "une ", "le ", "la ", "l'", "les ", "des "]
    if language == "en":
        articles = ["the ", "a ", "an "]
    if language == "de":
        articles = ["der ", "die ", "das ", "ein ", "eine "]

    sanitized_sentence = sentence
    for article in articles:
        sanitized_sentence = sanitized_sentence.replace(article, "")
    return sanitized_sentence


def sanitize_sentence(sentence, language="fr"):
    if language:
        sentence = remove_articles(sentence.lower(), language)

    sentence = "".join(e for e in sentence if e.isalpha())
    return str(
        unicodedata.normalize("NFD", sentence)
        .encode("ascii", "ignore")
        .decode("utf-8")
    )
