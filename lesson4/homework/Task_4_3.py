'''Дан словарь: {'test': 'test_value', 'europe': 'eur', 'dollar': 'usd', 'ruble': 'rub'}
Добавить каждому ключу число равное длине этого ключа (пример {‘key’: ‘value’} -> {‘key3’:
‘value’}). Чтобы получить список ключей - использовать метод .keys()'''

print('1)')
a = {'test': 'test_value', 'europe': 'eur', 'dollar': 'usd', 'ruble': 'rub'}

for key in list(a.keys()):
    j = key + str(len(key))
    print(j)
    a[j] = a[key]
    del a[key]
print(a)

print('2)')
a = {'test': 'test_value', 'europe': 'eur', 'dollar': 'usd', 'ruble': 'rub'}


b = list(a.keys())
i = 0

while i < len(b):
    key = b[i]
    j = key + str(len(key))
    print(j)
    a[j] = a[key]
    del a[key]
    i += 1
print(a)

# a[j] = a.pop(key)
