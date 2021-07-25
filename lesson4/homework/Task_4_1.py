from copy import copy

print('1 вариант:')

a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ]
i = 0
new_a = copy(a)

while i <= (len(a) - 1):
    new_a[i] = (int(a[i]) * (-2))
    i += 1

print(new_a)


print('2 вариант:')

b = copy(a)
for i in range (len(a)):
    b [i] *= -2
print(b)