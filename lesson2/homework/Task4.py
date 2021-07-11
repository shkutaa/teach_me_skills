phrase = 'Hello world'
a = list(phrase)

var = a[0:(len(a)-3)]
b = "".join(var)
print (b)
print(type(b) == str)