from django.contrib import admin
from .models import Category, Book, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',) }

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'category',  'author', 'price', 'availability')
    list_filter = ('category', 'availability')
    list_editable = ('price', 'availability')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'author', 'rate', 'text', 'created')




