'''
Для заданного числа N составьте программу вычисления суммы
S=1+1/2+1/3+1/4+...+1/N, где N – натуральное число
'''

N = int(input('Введите N > '))
i = 2
S = 1
while i <= N:
    S = S + 1/i
    i += 1
print(S)