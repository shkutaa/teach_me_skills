
a = list (range(1,20))
print(a)
max = 0

for i in a:
    if i > max:
        max = i
print(max)

for i in range(len(a)):
    if a[i] % 2 == 0:
        a[i] = max
print(a)