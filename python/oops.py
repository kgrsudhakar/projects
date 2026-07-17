"""
Python Core Concepts — Quick Reference Examples
Covers: Decorators, Generators, Context Managers, LEGB Scoping, OOP
"""

# ─────────────────────────────────────────────
# 1. DECORATORS
# ─────────────────────────────────────────────

# Basic decorator — wraps a function to add behavior
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    return a + b

print(slow_add(2, 3))


# Decorator with arguments (decorator factory)
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Sudhakar")


# ─────────────────────────────────────────────
# 2. GENERATORS
# ─────────────────────────────────────────────

# Basic generator — lazy evaluation, one value at a time
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

for num in count_up_to(5):
    print(num, end=" ")
print()


# Generator expression (memory-efficient alternative to list comprehension)
squares = (x * x for x in range(10))
print(sum(squares))  # generator consumed here, can't reuse


# Infinite generator with a stopping condition on the consumer side
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
print(first_10)


# ─────────────────────────────────────────────
# 3. CONTEXT MANAGERS
# ─────────────────────────────────────────────

# Using built-in context manager
with open(__file__, "r") as f:
    first_line = f.readline()
    print("First line of this file:", first_line.strip())


# Custom context manager via class (__enter__ / __exit__)
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        print(f"Elapsed: {time.time() - self.start:.4f}s")
        return False  # don't suppress exceptions

with Timer():
    total = sum(range(1_000_000))


# Custom context manager via contextlib (simpler for function-style logic)
from contextlib import contextmanager

@contextmanager
def open_resource(name):
    print(f"Opening {name}")
    yield name
    print(f"Closing {name}")

with open_resource("database connection") as res:
    print(f"Using {res}")


# ─────────────────────────────────────────────
# 4. LEGB SCOPING (Local, Enclosing, Global, Built-in)
# ─────────────────────────────────────────────

x = "global x"

def outer():
    x = "enclosing x"

    def inner():
        x = "local x"
        print(x)  # Local

    inner()
    print(x)  # Enclosing

outer()
print(x)  # Global


# nonlocal — modify enclosing scope variable from nested function
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
print(counter(), counter(), counter())  # 1 2 3


# ─────────────────────────────────────────────
# 5. OOP — Classes, Inheritance, Polymorphism
# ─────────────────────────────────────────────

class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement speak()")

    def __str__(self):
        return f"{self.__class__.__name__}({self.name})"


class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"


class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"


animals = [Dog("Rex"), Cat("Whiskers")]
for a in animals:
    print(a, "->", a.speak())  # polymorphism: same method call, different behavior


# Property decorator — controlled attribute access
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(f"Area: {c.area}")


# Classmethod vs staticmethod
class Employee:
    company = "Perficient"

    def __init__(self, name):
        self.name = name

    @classmethod
    def from_string(cls, data_str):
        name = data_str.split(",")[0]
        return cls(name)

    @staticmethod
    def is_valid_name(name):
        return isinstance(name, str) and len(name) > 0

emp = Employee.from_string("Sudhakar,Architect")
print(emp.name, emp.company)
print(Employee.is_valid_name("Sudhakar"))