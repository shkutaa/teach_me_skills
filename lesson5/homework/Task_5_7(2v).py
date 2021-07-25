from random import randint

n = 10

matrix = [[randint(1, 20) for i in range(n)] for j in range(n)]

for i in range(n):
    for j in range(n):
        print(matrix[i][j], end=' ')
    print(' ')

print("---"*20)

for i in range(n):
    max_num = max(matrix[i])
    max_index = matrix[i].index(max_num)
    swap = matrix[i][i]
    matrix[i][i] = max_num
    matrix[i][max_index] = swap

for i in range(n):
    for j in range(n):
        print(matrix[i][j], end=' ')
    print(' ')