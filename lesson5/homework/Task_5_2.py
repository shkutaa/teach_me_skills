'''Дано число. Найти сумму и произведение его цифр'''

x = int(input('Введите число > '))
sum = 0
mult = 1
while x > 0:
    sum += x % 10
    mult *= x % 10
    x //=10
print(sum)
print(mult)
