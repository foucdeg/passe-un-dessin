import os

from django.contrib.staticfiles.management.commands import runserver


class Command(runserver.Command):
    def handle(self, *args, **options):
        # Try to enable vscode debugger
        try:
            import debugpy

            # We only run the ptvsd server once, not on PID 1
            # Otherwise django attempts to start the server on every refresh.
            if os.getpid() != 1:
                debugpy.listen(("0.0.0.0", 9000))
                print("🖥  Remote debugger running.")
        except (ImportError, RuntimeError) as e:
            print("⚠️  Couldn't start remote debugger:", e)
        super(Command, self).handle(*args, **options)
