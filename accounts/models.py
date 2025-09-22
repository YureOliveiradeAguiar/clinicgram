from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager


# For making email the identification field instead of the useless username
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Custom user model extends from Django's AbstractUser. So it already includes the fields from AbstractUser:
# username, password, first_name, last_name, email, is_staff, is_superuser, is_active, last_login, date_joined
# But thats not the case here because AbstractBaseUser is used
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    firstName = models.CharField("First Name", max_length=30)
    lastName = models.CharField("Last Name", max_length=150)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # No username required
    
    def __str__(self):
        fullName = f"{self.firstName}{self.lastName}".strip()
        return fullName if fullName else self.email
