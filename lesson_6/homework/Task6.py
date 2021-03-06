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

#3) Минимальный элемент
def min_element (list):
    min = b
    for i in matrix:
        for j in i:
            if j < min:
                min = j
    return min
print('3) Минимальный элемени - ',min_element(matrix))

#4) Сумма всех элементов матрицы
def sum (list):
    sum = 0
    for i in list:
        for j in i:
            sum +=j
    return sum

print('4) Сумма элементов - ', sum(matrix))

#5) Индекс ряда с максимальной суммой
def row_index_sum (list):
    total = 0
    row_index = 0
    for i in range(m):
        sum = 0
        for j in range(n):
            sum += int(list[i][j])
            if sum > total:
                total = sum
                row_index = i
    return row_index + 1
print('5) Ряд с максимальной суммой - ', row_index_sum(matrix))

#6) Индекс колонки с максимальной суммой
def col_index_sum(list):
    total = 0
    col_index = 0
    for i in range(n):
        sum = 0
        for j in range(m):
            sum += int(list[j][i])
            if sum > total:
                total = sum
                col_index = i
    return col_index + 1
print('5) Столбец с максимальной суммой - ', col_index_sum(matrix))

#7) Индекс ряда с минимальнйо суммой
def row_index_min_sum (list):
    total = 10000000
    row_index = 0
    for i in range(m):
        sum = 0
        for j in range(n):
            sum += int(list[i][j])
            if sum < total:
                total = sum
                row_index = i
    return row_index + 1
print('5) Ряд с минимальной суммой - ', row_index_min_sum(matrix))

#8) Индекс столбца с минимальнйо суммой
def col_index_min_sum(list):
        total = 100000000
        col_index = 0
        for i in range(n):
            sum = 0

            for j in range(m):
                sum += int(list[j][i])
                if sum < total:
                    total = sum
                    col_index = i
        return col_index + 1

print('6) Столбец с минимальной суммой - ', col_index_min_sum(matrix))

#9) Обнулить все элементы выше главной диагонали
print('9)')
def null_up (list):
    for i in range(m):
        for j in range(1,n-i):
            list[i][j+i] = 0;
    return list
print(null_up(matrix))

#10) Обнулить все элементы ниже главной диагонали
print('10)')
def null_down(list):
    for i in range(1, m):
        for j in range(i):
            list[i][j] = 0;
    print(list)

null_down(matrix)