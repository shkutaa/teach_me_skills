
'''Дан список. Создать новый список, сдвинутый на 1 элемент влево'''
from copy import copy

a = [1, 2, 3, 4, 5, 6]
b = copy(a)

for i in range(len(b)):
    new_index = i - 1
    b[new_index] = b[i]
print(b)


i = len(b)-1
while i > len(b):
    new_index = i - 1
    b[new_index] = b[i]
    i -= 1
print(b)