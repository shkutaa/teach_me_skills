'''Два натуральных числа называют дружественными, если каждое из них
равно сумме всех делителей другого, кроме самого этого числа. Найти все
пары дружественных чисел, лежащих в диапазоне от 200 до 300. [02-3.2-HL02]'''

n = 200
m = 300

numbers = list(range(n, m+1))
number_with_div = []

for var in numbers:
    sum_of_div = 0
    for i in range (1, var+1):
        if not var % i:
            sum_of_div += i

    if sum_of_div in numbers:
        number_with_div.append((var,sum_of_div))

result = []
for number, div in number_with_div:
    if (div, number) in number_with_div:
        result.append(div)

print(result)