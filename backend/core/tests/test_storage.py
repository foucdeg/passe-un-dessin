import json
import os

from django.conf import settings
from django.test import TestCase

from core.storage import ManifestStorage


class ManifestStorageTestCase(TestCase):
    manifest = {
        "a.js": {"path": "b.js", "isInitial": True},
        "d.js": {"path": "e.js", "isInitial": False},
        "c.css": {"path": "f.css", "isInitial": True},
        "g.css": {"path": "h.css", "isInitial": False},
    }
    django_manifest = {
        "paths": {
            "front/b.js": "front/b.hash.js",
            "front/c.js": "front/c.hash.js",
            "d": "d.hash",
            "front/e.js": "front/e.hash.js",
            "front/f.css": "front/f.hash.css",
            "front/h.css": "front/h.hash.css",
        },
        "version": "1.0",
    }

    @classmethod
    def setUpClass(cls):
        cls.original_manifest_path = ManifestStorage.manifest_path
        ManifestStorage.manifest_path = f"{settings.BASE_DIR}/test.manifest"
        cls.original_manifest_name = ManifestStorage.manifest_name
        ManifestStorage.manifest_name = (
            f"{settings.BASE_DIR}/static/test.django.manifest"
        )

        manifest_path = os.path.abspath(ManifestStorage.manifest_path)
        with open(manifest_path, "w+") as manifest:
            json.dump(cls.manifest, manifest)

        django_manifest_path = os.path.abspath(ManifestStorage.manifest_name)
        with open(django_manifest_path, "w+") as manifest:
            json.dump(cls.django_manifest, manifest)

    @classmethod
    def tearDownClass(cls):
        ManifestStorage.manifest_path = cls.original_manifest_path
        ManifestStorage.manifest_name = cls.original_manifest_name

    def test_init(self):
        storage = ManifestStorage()
        self.assertEqual(storage.manifest, self.manifest)

    def test_get_manifest(self):
        storage = ManifestStorage()
        self.assertEqual(storage.get_manifest(), self.manifest)

    def test_is_supported(self):
        storage = ManifestStorage()
        self.assertTrue(storage.is_supported("front/a.js"))
        self.assertFalse(storage.is_supported("fronta.js"))
        self.assertFalse(storage.is_supported("other"))

    def test_mapped_path(self):
        storage = ManifestStorage()
        self.assertEqual(storage.mapped_path("front/a.js"), "front/b.js")
        self.assertEqual(storage.mapped_path("front/c.js"), "front/c.js")
        self.assertEqual(storage.mapped_path("d"), "d")

    def test_path(self):
        storage = ManifestStorage()
        self.assertEqual(
            storage.path("front/a.js"), f"{settings.STATIC_ROOT}/front/b.js"
        )
        self.assertEqual(
            storage.path("front/c.js"), f"{settings.STATIC_ROOT}/front/c.js"
        )
        self.assertEqual(storage.path("d"), f"{settings.STATIC_ROOT}/d")

    def test_url(self):
        storage = ManifestStorage()
        self.assertEqual(
            storage.url("front/a.js"), f"{settings.STATIC_URL}front/b.hash.js"
        )
        self.assertEqual(
            storage.url("front/c.js"), f"{settings.STATIC_URL}front/c.hash.js"
        )
        self.assertEqual(storage.url("d"), f"{settings.STATIC_URL}d.hash")

    def test_initial_scripts(self):
        storage = ManifestStorage()
        self.assertEqual(storage.initial_scripts(), ["front/a.js"])

    def test_initial_stylesheets(self):
        storage = ManifestStorage()
        self.assertEqual(storage.initial_stylesheets(), ["front/c.css"])
