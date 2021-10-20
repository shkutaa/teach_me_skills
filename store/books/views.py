from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import Category, Review

# Create your views here.
from rest_framework import generics

from books.models import Book
from books.serializers import BookSerializer
from .forms import ReviewForm


class APIBook(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class APIBookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

categories = Category.objects.all()



def book_list(request, category_slug = None):
    if category_slug:
        request_category = get_object_or_404(Category, slug = category_slug)
        books = Book.objects.filter(category=request_category)
    else:
        request_category = None
        books = Book.objects.all()

    return render(request, 'index.html',{
        'categories' : categories,
        'books': books,
        'request_category' : request_category,
    })

def book_detail(request, category_slug, book_id):
    category = get_object_or_404(Category, slug = category_slug)
    book = get_object_or_404(Book, id = book_id, category_id = category.id)

    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid:
            cf = form.cleaned_data
            author = 'John'
            Review.objects.create(product = book, author = author, text=cf['text'], rate = cf['rate'])
        return redirect('books:book_detail', category_slug=category_slug, book_id=book_id)
    else:
        form = ReviewForm()
    return render (request, 'detail.html', {'book': book, 'form':  form})