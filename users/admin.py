from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

# Django ka current active custom user model uthane ke liye
User = get_user_model()

class CustomUserAdmin(UserAdmin):
    model = User
    
    # 1. Admin list view mein role dikhane ke liye
    list_display = ['username', 'email', 'role', 'is_staff']
    
    # 2. User ke andar click karne par role field show karne ke liye
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )
    
    # 3. Naya user admin se banate waqt role set karne ke liye
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )

# Direct register karein, bina unregister wali line ke
admin.site.register(User, CustomUserAdmin)