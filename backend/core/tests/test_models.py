from django.test import TestCase

from core.models import BaseModel, User


class BaseModelTestCase(TestCase):
    def test_str(self):
        inst = BaseModel()
        self.assertRegexpMatches(str(inst), "^basemodel:[0-9a-f]{6}$")


class UserManagerTestCase(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(email="me@test.com", password="v3rys3cr3t")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        user = User.objects.create_superuser(email="me@test.com", password="v3rys3cr3t")
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="me@test.com", password="v3rys3cr3t", is_staff=False
            )

        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="me@test.com", password="v3rys3cr3t", is_superuser=False
            )

    def test_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="v3rys3cr3t")


class UserTestCase(TestCase):
    def test_save(self):
        user1 = User(email="me@me.me")
        user1.save()
        self.assertEqual(user1.username, user1.email)

        user2 = User(email="me2@me.me", username="haha")
        user2.save()
        self.assertEqual(user2.username, "haha")
