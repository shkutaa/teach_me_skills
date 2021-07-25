import copy
from random import randint

a = 1
b = 20

m = 3
n = 3

matrix = [[randint(a,b) for j in range(n)] for i in range(m)]

for i in range(m):
    for j in range(n):
        print(matrix[i][j],end =' ')
    print(' ')

#2) Максимальный элемент
def max_element (list):
    max = 0
    for i in list:
        for j in i:
            if j > max:
                max = j
    return max
print('2) Максимальный элемент - ', max_element(matrix))