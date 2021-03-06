'''Написать программу, в которой вводятся два операнда Х и Y и знак операции
sign (+, –, /, *). Вычислить результат Z в зависимости от знака. Предусмотреть
реакции на возможный неверный знак операции, а также на ввод Y=0 при
делении. Организовать возможность многократных вычислений без перезагрузки
программа (т.е. построить бесконечный цикл). В качестве символа прекращения
вычислений принять ‘0’ (т.е. sign='0').'''

while True:
    x = input('Введите x > ')
    y = input('Введите y > ')
    znak = input('Введите знак (+, -, *, /, 0)  > ')
    if znak not in ['+', '-', '*', '/', '0']:
        print('некорректный знак')
    else:
        if znak == '+':
            print(f'{x}+{y} = {x+y}')
        elif znak == '-':
            print(f'{x}-{y} = {x-y}')
        elif znak == '*':
            print(f'{x}*{y} = {x * y}'
        elif znak == '/':
            if y != 0:
                print(f'{x}/{y} = {x / y}')
            else:
                print('Деление наноль')
                break

        if znak == '0':
            print('Неверная операция')
            quit(0)