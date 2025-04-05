from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    context = {
        "current_user": reset_password_token.user,
        "player": (
            reset_password_token.user.player.name
            if reset_password_token.user.player
            else reset_password_token.user.username
        ),
        "email": reset_password_token.user.email,
        "reset_password_url": "{}/password-reset?token={}".format(
            settings.MAIN_FRONTEND, reset_password_token.key
        ),
    }

    email_subject = render_to_string("registration/password_reset_subj.txt", context)
    email_body = render_to_string("registration/password_reset_body.txt", context)

    msg = EmailMultiAlternatives(
        email_subject,
        email_body,
        settings.DEFAULT_FROM_EMAIL,
        [reset_password_token.user.email],
    )
    msg.send()
