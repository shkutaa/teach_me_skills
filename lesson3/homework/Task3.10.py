
'''
Получить на ввод количество рублей и копеек и вывести в правильной
форме, например, 3 рубля, 1 рубль 25 копеек, 3 копейки
'''

r = int(input('Введите рубли >> '))
k = int(input('Введите копейки >> '))

if r == 0 :
    print(f'{k} копеек')

elif k == 0  :

    print(f'{r} рублей')
else :
    print(f'{r} рублей {k} копеек' )

