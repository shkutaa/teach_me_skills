from django.db import models
from django.urls import reverse
from django.core.validators import MinValueValidator,MaxValueValidator
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name= 'Название')
    slug = models.SlugField(max_length=100, unique=True, verbose_name='slug')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
         return reverse('books:book_list_by_category',
                         args=[self.slug])


class Book (models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    image = models.ImageField(upload_to='media/products/', default='')
    pages = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(default='description')
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, default='')
    availability = models.BooleanField(default='True')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('books:book_detail', args=[self.category.slug, self.id])

class Review (models.Model):
    product = models. ForeignKey(Book, related_name ='reviews', on_delete=models.CASCADE)
    author = models.CharField(max_length=255)
    rate = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created',)


