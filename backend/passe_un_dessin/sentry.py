import sentry_sdk


class RequestIdMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If there's an `X-Request-Id` header on the request,
        # bind it to our Sentry SDK scope.
        request_id = request.META.get("HTTP_X_REQUEST_ID")
        if request_id:
            with sentry_sdk.configure_scope() as scope:
                scope.set_tag("request_id", request_id)

        response = self.get_response(request)
        if request_id:
            response["X-Request-ID"] = request_id

        return response
