a = 0
b = 1

i = 1
l = [b]

while i <= 15 - 1:
    c = a + b
    a = b
    b = c
    l.append(b)
    i += 1

print(l)

a = 0
b = 1
l = [b]
for i in range(15-1):
    c = a + b
    a = b
    b = c
    l.append(b)
print(l)