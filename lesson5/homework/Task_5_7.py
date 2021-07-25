'''Дана целочисленная квадратная матрица. Найти в каждой строке наи-w
больший элемент и поменять его местами с элементом главной диагонали.'''

from random import randint
n = 5
matrix = n * [n * [0]]

matrix = [[randint(1, 20) for i in range(n)] for j in range(n)]

print(matrix)



for i in range(n):
    max = 0
    max_index = 0
    for j in range(n):
        if matrix[i][j] > max:
            max = matrix[i][j]
            max_index = j
        if j == n-1:
            print(max)

    swap = matrix[i][i]
    matrix [i][i] = max
    matrix [i][max_index] = swap

print(matrix)



