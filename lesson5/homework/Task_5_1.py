x = input('Введите x > ')
y = input('Введите y > ')
znka = input('Введите знак (+, -, *, /)  > ')

def funcrion (x,y,znak):
    global z
    x = int(x)
    y = int(y)
    if znak not in ['+', '-', '*', '/']:
        print('некорректный знак')
    if znak == '+':
        z = x + y
        print(z)
    elif znak == '-':
        z = x + y
        print(z)
    elif znak == '*':
        z = x * y
        print(z)
    elif znak == '/':
        if y != 0:
            z = x / y
            print(z)
        else:
            print('Деление на ноль')
    else:
       pass



funcrion(x, y, znka)