
# __str__ is a special (magic/dunder) method in Python. It defines the string representation of an object. Whenever you print an object or convert it to a string, Python automatically calls __str__().

class Employee:
    def __init__(self, emp_id, name):
        self.emp_id = emp_id
        self.name = name

    def __str__(self):
        return f"{self.emp_id} - {self.name}"

e = Employee(101, "Sudhakar")
print(e)