'''Создать список поездов. Структура словаря: номер поезда,
пункт и время прибытия, пункт и время отбытия. Вывести все сведения о поездах,
время пребывания в пути которых превышает 7 часов 20 минут'''
from datetime import datetime, timedelta

delta_time = timedelta(hours = 7, minutes = 20)

trains = [
    {
        'number' : 1,
        'from' : 'Brest',
        'to': 'Minsk',
        'departure' : datetime(2021, 7, 26, 6, 20),
        'arrival' : datetime(2021, 7, 26, 9, 5),
    },
    {
        'number' : 2,
        'from' : 'Minsk',
        'to' : 'Mogilev',
        'departure' : datetime(2021, 7, 26, 16, 30),
        'arrival' : datetime(2021, 7, 26, 23, 55),
    }
]

for train in trains:
    if train['arrival'] - train['departure'] > delta_time:
        print(train)
