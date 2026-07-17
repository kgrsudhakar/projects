def test():
    return 'Hello'
print(test())

words = ["apple", "banana", "kiwi", "watermelon", "fig"]

longest = max(words, key=len)

print(f"String with max characters: '{longest}' ({len(longest)} chars)")

for i in range(1, 6):
    print(i)

square = lambda x: x * x
print(square(5))