from rest_framework.renderers import BrowsableAPIRenderer as DRFBrowsableAPIRenderer


class BrowsableAPIRenderer(DRFBrowsableAPIRenderer):
    def get_content(self, renderer, data, accepted_media_type, renderer_context):
        ret = super().get_content(renderer, data, accepted_media_type, renderer_context)
        return ret[: 1024 * 200]
