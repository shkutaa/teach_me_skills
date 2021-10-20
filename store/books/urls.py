from django.urls import path
from books.views import *

app_name = 'books'


urlpatterns = [
    path('API/books/', APIBook.as_view()),
    path('API/books/<int:pk>', APIBookDetail.as_view()),
    path('books/', book_list, name = 'book_list'),
    path('books/<slug:category_slug>', book_list, name = 'book_list_by_category'),
    path('books/<slug:category_slug>/<int:book_id>', book_detail, name = 'book_detail'),
]

