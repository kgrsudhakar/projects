numbers = [10, 15, 22, 35, 48, 51, 60]

even = 0
odd = 0

for num in numbers:
    if num % 2 == 0:
        even += 1
    else:
        odd += 1

print("Even Numbers:", even)
print("Odd Numbers:", odd)