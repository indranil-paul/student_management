from __future__ import absolute_import
from core.celery import app
from time import sleep
from django.core.mail import send_mail


@app.task
def mail_task(_duration, _mailparams = {}):
    subject = _mailparams["subject"]
    message = _mailparams["message"]
    err_message = ""
    receivers = [_mailparams["email"]]
    is_task_completed = False

    try:
        sleep(_duration)
        is_task_completed = True
    except Exception as e:
        err_message = e
        pass

    if is_task_completed:
        send_mail(subject, message, receivers)
    else:
        send_mail(subject, err_message, receivers)
